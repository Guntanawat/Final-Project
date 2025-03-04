import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const employeeId = Number(params.employeeId);
  console.log("🚀 ~ API Received employeeId:", employeeId);

  try {
    const appointments = await prisma.appointments.findMany({
      where: { user_id: employeeId },
      include: {
        employee: {
          select: { name: true },
        },
      },
    });

    console.log("🚀 ~ Appointments found:", appointments);

    if (!appointments || appointments.length === 0) {
      return new Response(
        JSON.stringify({ message: "Appointments not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ message: "Success", appointments }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching appointments" }),
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const employeeId = params.employeeId;

  try {
    // ตรวจสอบว่ามี employee ที่ต้องการอัปเดตหรือไม่
    const Appointment = await prisma.appointments.findFirst({
      where: { id: Number(employeeId) }, // แปลง id เป็นตัวเลขหากจำเป็น
    });

    if (!Appointment) {
      return new Response(
        JSON.stringify({ message: "Appointment not found" }),
        {
          status: 404,
        }
      );
    }

    // อ่านข้อมูลที่ส่งมาผ่าน request body
    const body = await request.json();

    // อัปเดตข้อมูล Appointment ตาม id
    const updatedAppointment = await prisma.appointments.update({
      where: { id: Number(employeeId) },
      data: {
        name: body.name,
        phone_number: body.phone_number,
        employee_id: body.position, // Use Alice's ID
        appointment_time: new Date("2024-08-15T10:00:00Z"),
        status: "pending",
      },
    });

    // คืนค่าข้อมูล employee ที่อัปเดตสำเร็จ
    return new Response(
      JSON.stringify({
        message: "Employee updated successfully",
        updatedAppointment,
      }),
      { status: 200 }
    );
  } catch (error) {
    // คืนค่าข้อความแจ้งเตือนหากเกิดข้อผิดพลาด
    return new Response(JSON.stringify({ error: "Error updating employee" }), {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  try {
    const appointments = await prisma.appointments.delete({
      where: {
        id: parseInt(params.employeeId),
      },
    });
    return Response.json(
      {
        status: 200,
      },
      { statusText: "Deleted" }
    );
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return Response.json(
      { error: "Error fetching appointments" },
      { status: 500 }
    );
  }
}
