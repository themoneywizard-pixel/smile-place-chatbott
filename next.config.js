export const metadata = {
  title: "น้องฟัน AI | คลินิกทันตกรรม สไมล์เพลส",
  description: "ผู้ช่วย AI สำหรับคลินิกทันตกรรม สไมล์เพลส - ตอบคำถาม จองนัด 24 ชม.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
