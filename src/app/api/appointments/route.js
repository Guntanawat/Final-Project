import prisma from "../../../lib/prisma"; // แก้ไข path ให้ถูกต้อง

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany();
    return new Response(JSON.stringify(appointments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch appointments" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// คุณสามารถเพิ่มฟังก์ชันสำหรับ methods อื่นๆ เช่น POST, PUT, DELETE ได้ในลักษณะเดียวกัน
