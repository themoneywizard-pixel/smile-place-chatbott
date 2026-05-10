"use client";
import { useState, useEffect } from "react";
import styles from "./admin.module.css";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function AdminPanel() {
  const [clinicData, setClinicData] = useState({
    clinic_name: "",
    assistant_name: "",
    address: "",
    business_hours: "",
    phone: "",
  });

  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ service_name: "", price: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch clinic data
  useEffect(() => {
    fetchClinicData();
  }, []);

  const fetchClinicData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/clinic_config?select=*`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch clinic data");

      const data = await res.json();
      if (data.length > 0) {
        setClinicData(data[0]);
      }

      // Fetch services
      const servicesRes = await fetch(
        `${SUPABASE_URL}/rest/v1/clinic_services?select=*&order=display_order`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      }

      setLoading(false);
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลได้");
      setLoading(false);
    }
  };

  const handleClinicDataChange = (field, value) => {
    setClinicData((prev) => ({ ...prev, [field]: value }));
  };

  const saveClinicData = async () => {
    try {
      setError("");
      setSuccess("");

      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/clinic_config?id=eq.${clinicData.id}`,
        {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_KEY,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({
            clinic_name: clinicData.clinic_name,
            assistant_name: clinicData.assistant_name,
            address: clinicData.address,
            business_hours: clinicData.business_hours,
            phone: clinicData.phone,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save clinic data");

      setSuccess("บันทึกข้อมูลสำเร็จ!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  const addService = async () => {
    if (!newService.service_name || !newService.price) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      setError("");

      const res = await fetch(`${SUPABASE_URL}/rest/v1/clinic_services`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=representation",
        },
        body: JSON.stringify({
          service_name: newService.service_name,
          price: newService.price,
          display_order: services.length + 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add service");

      const newData = await res.json();
      setServices([...services, newData[0]]);
      setNewService({ service_name: "", price: "" });
      setSuccess("เพิ่มบริการสำเร็จ!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  const deleteService = async (id) => {
    if (!confirm("ยืนยันการลบ?")) return;

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/clinic_services?id=eq.${id}`,
        {
          method: "DELETE",
          headers: {
            apikey: SUPABASE_KEY,
            "Prefer": "return=minimal",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete service");

      setServices(services.filter((s) => s.id !== id));
      setSuccess("ลบบริการสำเร็จ!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  if (loading) return <div className={styles.container}>กำลังโหลด...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <h1>⚙️ Admin Panel - สไมล์เพลส</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Clinic Info Section */}
        <section className={styles.section}>
          <h2>ข้อมูลคลินิก</h2>

          <div className={styles.formGroup}>
            <label>ชื่อคลินิก</label>
            <input
              type="text"
              value={clinicData.clinic_name || ""}
              onChange={(e) => handleClinicDataChange("clinic_name", e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>ชื่อผู้ช่วย AI</label>
            <input
              type="text"
              value={clinicData.assistant_name || ""}
              onChange={(e) => handleClinicDataChange("assistant_name", e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>ที่อยู่</label>
            <textarea
              value={clinicData.address || ""}
              onChange={(e) => handleClinicDataChange("address", e.target.value)}
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>เวลาทำการ</label>
            <textarea
              value={clinicData.business_hours || ""}
              onChange={(e) => handleClinicDataChange("business_hours", e.target.value)}
              className={styles.textarea}
              rows={2}
            />
          </div>

          <div className={styles.formGroup}>
            <label>เบอร์โทรศัพท์</label>
            <input
              type="text"
              value={clinicData.phone || ""}
              onChange={(e) => handleClinicDataChange("phone", e.target.value)}
              className={styles.input}
            />
          </div>

          <button onClick={saveClinicData} className={styles.btnPrimary}>
            💾 บันทึกข้อมูลคลินิก
          </button>
        </section>

        {/* Services Section */}
        <section className={styles.section}>
          <h2>บริการและราคา</h2>

          <div className={styles.servicesList}>
            {services.map((service) => (
              <div key={service.id} className={styles.serviceItem}>
                <div>
                  <div className={styles.serviceName}>{service.service_name}</div>
                  <div className={styles.servicePrice}>{service.price}</div>
                </div>
                <button
                  onClick={() => deleteService(service.id)}
                  className={styles.btnDanger}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className={styles.addService}>
            <h3>เพิ่มบริการใหม่</h3>
            <div className={styles.formGroup}>
              <label>ชื่อบริการ</label>
              <input
                type="text"
                value={newService.service_name}
                onChange={(e) =>
                  setNewService({ ...newService, service_name: e.target.value })
                }
                className={styles.input}
                placeholder="เช่น ขูดหินปูน"
              />
            </div>

            <div className={styles.formGroup}>
              <label>ราคา</label>
              <input
                type="text"
                value={newService.price}
                onChange={(e) =>
                  setNewService({ ...newService, price: e.target.value })
                }
                className={styles.input}
                placeholder="เช่น 800 บาท"
              />
            </div>

            <button onClick={addService} className={styles.btnSuccess}>
              ➕ เพิ่มบริการ
            </button>
          </div>
        </section>

        <div className={styles.footer}>
          💡 หลังจากแก้ไข chatbot จะอัปเดตอัตโนมัติใน 5 นาที
        </div>
      </div>
    </div>
  );
}
