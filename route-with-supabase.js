const SYSTEM_PROMPT_TEMPLATE = (clinicData) => `คุณคือผู้ช่วยของ "${clinicData.clinicName}" ชื่อของคุณคือ "${clinicData.assistantName}"

=== ข้อมูลคลินิก ===
ชื่อ: ${clinicData.clinicName}
ที่อยู่: ${clinicData.address}
เวลาทำการ: ${clinicData.businessHours}
เบอร์โทร: ${clinicData.phone}

=== บริการและราคา ===
${clinicData.services.map(s => `- ${s.name}: ${s.price}`).join("\n")}

=== กฎการตอบ ===
1. ตอบภาษาไทยเสมอ ใช้ภาษาที่เป็นมิตร สุภาพ อ่านง่าย
2. ถ้ามีคนถามเรื่องจองนัด ให้ถามชื่อ เบอร์โทร และวันที่ที่สะดวก
3. ถ้าไม่ทราบข้อมูล ให้บอกให้โทรมาที่คลินิกโดยตรง
4. ห้ามวินิจฉัยโรคหรือให้คำแนะนำทางการแพทย์เกินขอบเขต
5. ตอบกระชับ ชัดเจน ไม่เกิน 3-4 ประโยคต่อข้อความ
6. ถ้ามีคนถามเรื่องราคา ให้บอกราคาและแนะนำให้มาตรวจก่อนเพื่อประเมินราคาจริง`;

// Cache for clinic data (refresh every 5 minutes)
let cachedClinicData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getClinicData() {
  const now = Date.now();
  
  // Return cached data if still fresh
  if (cachedClinicData && now - cacheTimestamp < CACHE_DURATION) {
    return cachedClinicData;
  }

  try {
    // Fetch from Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase env vars not found, using fallback data");
      return getFallbackClinicData();
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/clinic_config?select=*`,
      {
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch clinic data from Supabase");
      return getFallbackClinicData();
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No clinic data found in Supabase");
      return getFallbackClinicData();
    }

    const clinicData = data[0];

    // Fetch services
    const servicesResponse = await fetch(
      `${supabaseUrl}/rest/v1/clinic_services?select=*`,
      {
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
        },
      }
    );

    const services = servicesResponse.ok ? await servicesResponse.json() : [];

    const formattedData = {
      clinicName: clinicData.clinic_name || "คลินิกทันตกรรม สไมล์เพลส",
      assistantName: clinicData.assistant_name || "น้องฟัน",
      address: clinicData.address || "123 ถนนสุขุมวิท แขวงคลองเตย กรุงเทพฯ",
      businessHours: clinicData.business_hours || "จันทร์–เสาร์ 09:00–18:00 น.",
      phone: clinicData.phone || "02-xxx-xxxx",
      services: services.map(s => ({
        name: s.service_name,
        price: s.price,
      })) || [],
    };

    // Update cache
    cachedClinicData = formattedData;
    cacheTimestamp = now;

    return formattedData;
  } catch (error) {
    console.error("Error fetching clinic data:", error);
    return getFallbackClinicData();
  }
}

function getFallbackClinicData() {
  return {
    clinicName: "คลินิกทันตกรรม สไมล์เพลส",
    assistantName: "น้องฟัน",
    address: "123 ถนนสุขุมวิท แขวงคลองเตย กรุงเทพฯ",
    businessHours: "จันทร์–เสาร์ 09:00–18:00 น. (หยุดวันอาทิตย์)",
    phone: "02-xxx-xxxx",
    services: [
      { name: "ตรวจฟัน/ปรึกษา", price: "ฟรี" },
      { name: "ขูดหินปูน", price: "800 บาท" },
      { name: "อุดฟัน (คอมโพสิต)", price: "500–800 บาท" },
      { name: "ถอนฟัน", price: "500–1,500 บาท" },
      { name: "จัดฟัน", price: "เริ่มต้น 35,000 บาท" },
      { name: "ฟันปลอม", price: "เริ่มต้น 3,500 บาท" },
      { name: "ฟอกสีฟัน", price: "3,500 บาท" },
      { name: "รากฟันเทียม", price: "เริ่มต้น 25,000 บาท" },
    ],
  };
}

export async function POST(request) {
  try {
    const { messages } = await request.json();

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Validate API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY not found in environment");
      return Response.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get clinic data (with caching)
    const clinicData = await getClinicData();
    const systemPrompt = SYSTEM_PROMPT_TEMPLATE(clinicData);

    // Call Anthropic API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    });

    // Check if response is OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Anthropic API error:", errorData);
      return Response.json(
        { error: "Failed to get response from AI service" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Validate response structure
    if (!data.content || !Array.isArray(data.content)) {
      console.error("Invalid API response structure:", data);
      return Response.json(
        { error: "Invalid response from AI service" },
        { status: 500 }
      );
    }

    return Response.json({ content: data.content });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
