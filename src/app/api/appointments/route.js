import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appointments = await prisma.appointments.findMany({
      include: {
        employee: true, // Include the employee data associated with each appointment
      },
    });
    return Response.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return Response.json(
      { error: "Error fetching appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // อ่านข้อมูลที่ส่งมาผ่าน request body
    const body = await request.json();
    console.log("🚀 ~ POST ~ body:", body);

    // ตรวจสอบว่าได้รับข้อมูลที่จำเป็นหรือไม่
    if (
      !body.name ||
      !body.position ||
      !body.phone_number ||
      !body.email
      // !body.password
    ) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // สร้าง employee ใหม่
    const newAppointments = await prisma.appointments.create({
      data: {
        name: body.name,
        phone_number: body.phone_number,
        employee_id: body.position,
        appointment_time: new Date(body.date_time),
        status: "pending",
        // password: body.password, // ควรเข้ารหัสรหัสผ่านก่อนเก็บในฐานข้อมูล
      },
    });

    // name: "John Doe",
    //     phone_number: "0123456789",
    //     employee_id: alice.id, // Use Alice's ID
    //     appointment_time: new Date("2024-08-15T10:00:00Z"),
    //     status: "pending",
    //     created_at: new Date(),
    // คืนค่าข้อมูล employee ที่สร้างสำเร็จ
    return new Response(
      JSON.stringify({
        message: "Employee created successfully",
        newAppointments,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating employee:", error);

    // คืนค่าข้อความแจ้งเตือนหากเกิดข้อผิดพลาด
    return new Response(JSON.stringify({ error: "Error creating employee" }), {
      status: 500,
    });
  }
}
