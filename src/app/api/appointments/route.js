import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // ดึง query parameters จาก URL
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employee_id");

    // ตรวจสอบว่า employee_id ถูกส่งมาหรือไม่
    const whereCondition = employeeId
      ? { employee_id: Number(employeeId) }
      : {};

    // ดึงข้อมูล appointments โดยกรองตาม employee_id (ถ้ามี)
    const appointments = await prisma.appointments.findMany({
      where: whereCondition,
      include: {
        employee: true,
      },
    });

    return new Response(JSON.stringify(appointments), { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching appointments" }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Request body:", body);

    // ตรวจสอบข้อมูลที่จำเป็นตาม schema และแปลงค่าให้ถูกต้อง
    const appointmentData = {
      name: body.name,
      phone_number: body.phone_number?.toString(),
      employee_id: Number(body.employee_id || body.position), // รองรับทั้ง employee_id และ position
      user_id: Number(body.user_id || body.userId), // รองรับทั้ง user_id และ userId
      appointment_time: new Date(body.date_time || body.appointment_time), // รองรับทั้ง date_time และ appointment_time
      status: "pending",
    };

    // ตรวจสอบว่าข้อมูลครบถ้วน
    if (
      !appointmentData.name ||
      !appointmentData.phone_number ||
      !appointmentData.employee_id ||
      !appointmentData.user_id ||
      isNaN(appointmentData.appointment_time.getTime())
    ) {
      return new Response(
        JSON.stringify({
          message: "Missing or invalid required fields",
          receivedData: body,
          parsedData: appointmentData,
        }),
        { status: 400 }
      );
    }

    // สร้าง appointment ใหม่
    console.log("🚀 ~ POST ~ appointmentData:", appointmentData);
    const newAppointment = await prisma.appointments.create({
      data: appointmentData,
      include: {
        employee: true,
        user: true,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Appointment created successfully",
        appointment: newAppointment,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return new Response(
      JSON.stringify({
        error: "Error creating appointment",
        details: error.message,
        stack: error.stack, // เพิ่ม stack trace เพื่อ debug
      }),
      { status: 500 }
    );
  }
}
