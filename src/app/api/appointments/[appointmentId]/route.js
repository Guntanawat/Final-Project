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
  const appointmentId = Number(params.appointmentId);
  console.log("🚀 ~ PUT ~ appointmentId:", appointmentId);

  try {
    // 📌 ค้นหานัดหมายที่ต้องการอัปเดต
    const existingAppointment = await prisma.appointments.findFirst({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      return new Response(
        JSON.stringify({ message: "Appointment not found" }),
        { status: 404 }
      );
    }

    // 📌 อ่านข้อมูลจาก request body
    const body = await request.json();
    console.log("🚀 ~ PUT ~ body:", body);

    // ตรวจสอบว่ามีเฉพาะ status หรือไม่
    if (body.statusOnly && body.status) {
      // อัพเดทเฉพาะสถานะ
      const updatedAppointment = await prisma.appointments.update({
        where: { id: appointmentId },
        data: { status: body.status },
      });

      return new Response(
        JSON.stringify({
          message: "Appointment status updated successfully",
          updatedAppointment,
        }),
        { status: 200 }
      );
    }

    // กรณีอัพเดทข้อมูลทั้งหมด (โค้ดเดิม)
    const updatedAppointmentData = {
      name: body.name,
      phone_number: body.phone_number,
      employee_id: Number(body.position || body.employee_id), // รองรับทั้ง position และ employee_id
      user_id: Number(body.user_id),
      appointment_time: new Date(body.appointment_time || body.date_time),
      status: body.status || "pending",
    };

    console.log("🚀 ~ PUT ~ updatedAppointmentData:", updatedAppointmentData);

    // 📌 ตรวจสอบว่าข้อมูลครบหรือไม่
    if (
      !updatedAppointmentData.name ||
      !updatedAppointmentData.phone_number ||
      !updatedAppointmentData.employee_id ||
      !updatedAppointmentData.user_id ||
      isNaN(new Date(updatedAppointmentData.appointment_time).getTime())
    ) {
      return new Response(
        JSON.stringify({
          message: "Missing or invalid required fields",
          receivedData: body,
          parsedData: updatedAppointmentData,
        }),
        { status: 400 }
      );
    }

    // ✅ อัปเดตข้อมูล Appointment โดยไม่เช็คเวลาซ้ำ
    const updatedAppointment = await prisma.appointments.update({
      where: { id: appointmentId },
      data: updatedAppointmentData,
    });

    return new Response(
      JSON.stringify({
        message: "Appointment updated successfully",
        updatedAppointment,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appointment:", error);
    return new Response(
      JSON.stringify({
        error: "Error updating appointment",
        details: error.message,
      }),
      { status: 500 }
    );
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
