import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const appointmentId = params.appointmentId;

  try {
    // ตรวจสอบว่ามี employee ที่ต้องการลบหรือไม่
    const appointment = await prisma.appointments.findFirst({
      where: { id: Number(appointmentId) }, // แปลง id เป็นตัวเลขหากจำเป็น
    });

    if (!appointment) {
      return new Response(
        JSON.stringify({ message: "appointment not found" }),
        {
          status: 404,
        }
      );
    }

    // คืนค่าข้อมูล appointment ที่ถูกลบ
    return new Response(
      JSON.stringify({
        message: "appointment deleted successfully",
        appointment,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting employee:", error);

    // คืนค่าข้อความแจ้งเตือนหากเกิดข้อผิดพลาด
    return new Response(JSON.stringify({ error: "Error deleting employee" }), {
      status: 500,
    });
  }
}
export async function PUT(request, { params }) {
  const appointmentId = params.appointmentId;

  try {
    // ตรวจสอบว่ามี employee ที่ต้องการอัปเดตหรือไม่
    const Appointment = await prisma.appointments.findFirst({
      where: { id: Number(appointmentId) }, // แปลง id เป็นตัวเลขหากจำเป็น
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
      where: { id: Number(appointmentId) },
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
        id: parseInt(params.appointmentId),
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
