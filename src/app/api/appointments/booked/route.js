import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("barberId");
    const selectedDate = searchParams.get("date");

    // ✅ เช็คว่ามีการส่ง employeeId และวันที่มาหรือไม่
    if (!employeeId || !selectedDate) {
      return new Response(
        JSON.stringify({ error: "Missing barberId or date parameter" }),
        { status: 400 }
      );
    }

    // ✅ ดึงเวลาที่ถูกจองแล้วในวันนั้นสำหรับ Barber ที่เลือก
    const bookedAppointments = await prisma.appointments.findMany({
      where: {
        employee_id: Number(employeeId),
        appointment_time: {
          gte: new Date(`${selectedDate}T00:00:00.000Z`),
          lt: new Date(`${selectedDate}T23:59:59.999Z`),
        },
      },
      select: {
        appointment_time: true,
      },
    });
    console.log("🚀 ~ GET ~ bookedAppointments:", bookedAppointments);

    return new Response(JSON.stringify(bookedAppointments), { status: 200 });
  } catch (error) {
    console.error("Error fetching booked times:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching booked times" }),
      { status: 500 }
    );
  }
}
