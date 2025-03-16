import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // ดึง query parameters จาก URL
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employee_id");

    // กำหนดช่วงเวลาของวันนี้
    const now = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Offset 7 ชั่วโมง

    // คำนวณวันปัจจุบันในเขตเวลาไทย
    const localDate = new Date(now.getTime() + timezoneOffset);

    // ตั้งค่าให้เป็น 00:00:00.000 (เริ่มต้นของวัน)
    const startOfDay = new Date(
      Date.UTC(
        localDate.getUTCFullYear(),
        localDate.getUTCMonth(),
        localDate.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );

    // ตั้งค่าให้เป็น 23:59:59.999 (สิ้นสุดของวัน)
    const endOfDay = new Date(
      Date.UTC(
        localDate.getUTCFullYear(),
        localDate.getUTCMonth(),
        localDate.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    console.log("🚀 ~ GET ~ startOfDay:", startOfDay.toISOString());
    console.log("🚀 ~ GET ~ endOfDay:", endOfDay.toISOString());

    // ตรวจสอบว่า employee_id ถูกส่งมาหรือไม่
    const whereCondition = {
      ...(employeeId ? { employee_id: Number(employeeId) } : {}),
      appointment_time: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    // ดึงข้อมูล appointments ของวันนี้
    const appointments = await prisma.appointments.findMany({
      where: whereCondition,
      include: {
        employee: true,
      },
    });

    // กำหนดลำดับความสำคัญของสถานะ
    const statusPriority = {
      pending: 1,
      booked: 2,
      success: 3,
    };

    // เรียงลำดับข้อมูลตามสถานะที่กำหนด
    const sortedAppointments = [...appointments].sort((a, b) => {
      const priorityA = statusPriority[a.status] || 999;
      const priorityB = statusPriority[b.status] || 999;

      return priorityA - priorityB;
    });

    return new Response(JSON.stringify(sortedAppointments), { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching appointments" }),
      { status: 500 }
    );
  }
}

// export async function POST(request) {
//   try {
//     const body = await request.json();

//     // ตรวจสอบข้อมูลที่จำเป็นตาม schema และแปลงค่าให้ถูกต้อง
//     const appointmentData = {
//       name: body.name,
//       phone_number: body.phone_number?.toString(),
//       employee_id: Number(body.employee_id || body.position), // รองรับทั้ง employee_id และ position
//       user_id: Number(body.user_id || body.userId), // รองรับทั้ง user_id และ userId
//       appointment_time: new Date(body.date_time || body.appointment_time), // รองรับทั้ง date_time และ appointment_time
//       status: "pending",
//     };

//     // ตรวจสอบว่าข้อมูลครบถ้วน
//     if (
//       !appointmentData.name ||
//       !appointmentData.phone_number ||
//       !appointmentData.employee_id ||
//       !appointmentData.user_id ||
//       isNaN(appointmentData.appointment_time.getTime())
//     ) {
//       return new Response(
//         JSON.stringify({
//           message: "Missing or invalid required fields",
//           receivedData: body,
//           parsedData: appointmentData,
//         }),
//         { status: 400 }
//       );
//     }

//     // สร้าง appointment ใหม่
//     console.log("🚀 ~ POST ~ appointmentData:", appointmentData);
//     const newAppointment = await prisma.appointments.create({
//       data: appointmentData,
//       include: {
//         employee: true,
//         user: true,
//       },
//     });

//     return new Response(
//       JSON.stringify({
//         message: "Appointment created successfully",
//         appointment: newAppointment,
//       }),
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating appointment:", error);
//     return new Response(
//       JSON.stringify({
//         error: "Error creating appointment",
//         details: error.message,
//         stack: error.stack, // เพิ่ม stack trace เพื่อ debug
//       }),
//       { status: 500 }
//     );
//   }
// }
export async function POST(request) {
  try {
    const body = await request.json();

    // แปลงค่าจาก request
    const appointmentData = {
      name: body.name,
      phone_number: body.phone_number?.toString(),
      employee_id: Number(body.employee_id || body.position),
      user_id: Number(body.user_id || body.userId),
      appointment_time: new Date(body.date_time || body.appointment_time),
      status: "pending",
    };

    // ตรวจสอบว่าข้อมูลครบหรือไม่
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

    // 📌 คำนวณช่วงเวลาของการนัดหมาย (30 นาที)
    const appointmentDuration = 30 * 60 * 1000; // 30 นาทีเป็นมิลลิวินาที
    const requestedTime = new Date(appointmentData.appointment_time);
    const endTime = new Date(requestedTime.getTime() + appointmentDuration);

    // 📌 ค้นหาการจองที่ทับซ้อนกับช่วงเวลานี้
    const overlappingAppointments = await prisma.appointments.findMany({
      where: {
        employee_id: appointmentData.employee_id,
        status: { not: "cancelled" }, // ไม่รวมที่ถูกยกเลิก
        OR: [
          {
            appointment_time: {
              gte: requestedTime, // การจองเริ่มหลังจาก หรือ เท่ากับ requestedTime
              lt: endTime, // และอยู่ก่อนเวลาสิ้นสุด
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

    // ✅ เวลาผ่านเงื่อนไข สามารถสร้างการจองใหม่ได้
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
        stack: error.stack,
      }),
      { status: 500 }
    );
  }
}
