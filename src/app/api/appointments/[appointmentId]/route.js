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
    const updatedAppointmentData = {
      name: body.name,
      phone_number: body.phone_number,
      employee_id: Number(body.position || body.employee_id), // รองรับทั้ง position และ employee_id
      user_id: Number(body.user_id),
      appointment_time: new Date(body.appointment_time || body.date_time),
      status: body.status || "pending",
    };

    // 📌 ตรวจสอบว่าข้อมูลครบหรือไม่
    if (
      !updatedAppointmentData.name ||
      !updatedAppointmentData.phone_number ||
      !updatedAppointmentData.employee_id ||
      !updatedAppointmentData.user_id ||
      isNaN(updatedAppointmentData.appointment_time.getTime())
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

    // 📌 คำนวณช่วงเวลาของการนัดหมาย (30 นาที)
    const appointmentDuration = 30 * 60 * 1000; // 30 นาทีเป็นมิลลิวินาที
    const requestedTime = new Date(updatedAppointmentData.appointment_time);
    const endTime = new Date(requestedTime.getTime() + appointmentDuration);

    // 📌 ตรวจสอบว่ามีการจองที่ทับซ้อนกันหรือไม่
    const overlappingAppointments = await prisma.appointments.findMany({
      where: {
        employee_id: updatedAppointmentData.employee_id, // ✅ เช็คเฉพาะช่างคนนั้น
        status: { not: "cancelled" }, // ✅ ไม่รวมการจองที่ถูกยกเลิก
        id: { not: appointmentId }, // ✅ ต้องไม่ใช่การอัปเดตตัวเอง
        OR: [
          {
            appointment_time: {
              gte: requestedTime, // เริ่มหลังจากหรือเท่ากับเวลาที่ลูกค้าขอ
              lt: endTime, // และอยู่ก่อนเวลาสิ้นสุดของการนัดหมาย (30 นาที)
            },
          },
          {
            appointment_time: {
              lt: requestedTime, // มีการจองที่เริ่มก่อนเวลาที่ร้องขอ
              gte: new Date(requestedTime.getTime() - appointmentDuration), // และจบภายในช่วง 30 นาทีของ requestedTime
            },
          },
        ],
      },
    });

    // 📌 ถ้าพบว่ามีการจองซ้ำ ให้แจ้งเตือนลูกค้า
    if (overlappingAppointments.length > 0) {
      return new Response(
        JSON.stringify({
          message: "Selected time is unavailable. Please choose another time.",
          existingAppointments: overlappingAppointments.map((appt) => ({
            id: appt.id,
            time: appt.appointment_time,
          })),
        }),
        { status: 400 }
      );
    }

    // ✅ อัปเดตข้อมูล Appointment ได้
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

// export async function PUT(request, { params }) {
//   const appointmentId = params.appointmentId;

//   try {
//     // ตรวจสอบว่ามี employee ที่ต้องการอัปเดตหรือไม่
//     const Appointment = await prisma.appointments.findFirst({
//       where: { id: Number(appointmentId) }, // แปลง id เป็นตัวเลขหากจำเป็น
//     });

//     if (!Appointment) {
//       return new Response(
//         JSON.stringify({ message: "Appointment not found" }),
//         {
//           status: 404,
//         }
//       );
//     }

//     // อ่านข้อมูลที่ส่งมาผ่าน request body
//     const body = await request.json();

//     // อัปเดตข้อมูล Appointment ตาม id
//     const updatedAppointment = await prisma.appointments.update({
//       where: { id: Number(appointmentId) },
//       data: {
//         name: body.name,
//         phone_number: body.phone_number,
//         employee_id: body.position,
//         user_id: body.user_id,
//         appointment_time: new Date("2024-08-15T10:00:00Z"),
//         status: "pending",
//       },
//     });

//     // คืนค่าข้อมูล employee ที่อัปเดตสำเร็จ
//     return new Response(
//       JSON.stringify({
//         message: "Appointment updated successfully",
//         updatedAppointment,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     // คืนค่าข้อความแจ้งเตือนหากเกิดข้อผิดพลาด
//     return new Response(
//       JSON.stringify({ error: "Error updating appointment" }),
//       {
//         status: 500,
//       }
//     );
//   }
// }

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
