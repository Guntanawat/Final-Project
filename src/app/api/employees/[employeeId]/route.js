import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// export async function GET(request, { params }) {
//   return Response.json({
//     message: `Hello from /api/${params.employeeId}`,
//   });
// }

// export async function DELETE(request, { params }) {
//   const employeeId = params.employeeId; // รับ id จาก URL params
//   try {
//     const deletedEmployee = await prisma.employees.delete({
//       where: { id: Number(employeeId) },
//     }); // ตรวจสอบชื่อตารางและวิธีการเรียกใช้งาน
//     return new Response(
//       JSON.stringify({ message: "Employee deleted", deletedEmployee }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting employee:", error);
//     return new Response(JSON.stringify({ error: "Error deleting employee" }), {
//       status: 500,
//     });
//   }
// }
export async function GET(request, { params }) {
  const employeeId = params.employeeId;

  try {
    // ตรวจสอบว่ามี employee ที่ต้องการลบหรือไม่
    const employee = await prisma.employees.findFirst({
      where: { id: Number(employeeId) }, // แปลง id เป็นตัวเลขหากจำเป็น
    });

    if (!employee) {
      return new Response(JSON.stringify({ message: "Employee not found" }), {
        status: 404,
      });
    }

    // คืนค่าข้อมูล employee ที่ถูกลบ
    return new Response(
      JSON.stringify({
        message: "Employee deleted successfully",
        employee,
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
  const employeeId = params.employeeId;

  try {
    // ตรวจสอบว่ามี employee ที่ต้องการอัปเดตหรือไม่
    const employee = await prisma.employees.findFirst({
      where: { id: Number(employeeId) }, // แปลง id เป็นตัวเลขหากจำเป็น
    });

    if (!employee) {
      return new Response(JSON.stringify({ message: "Employee not found" }), {
        status: 404,
      });
    }

    // อ่านข้อมูลที่ส่งมาผ่าน request body
    const body = await request.json();

    // อัปเดตข้อมูล employee ตาม id
    const updatedEmployee = await prisma.employees.update({
      where: { id: Number(employeeId) },
      data: {
        name: body.name,
        position: body.position,
        phone_number: body.phone_number,
        email: body.email,
        password: body.password, // อย่าลืมว่าควรจะมีการเข้ารหัสรหัสผ่านก่อนเก็บในฐานข้อมูล
      },
    });

    // คืนค่าข้อมูล employee ที่อัปเดตสำเร็จ
    return new Response(
      JSON.stringify({
        message: "Employee updated successfully",
        updatedEmployee,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating employee:", error);

    // คืนค่าข้อความแจ้งเตือนหากเกิดข้อผิดพลาด
    return new Response(JSON.stringify({ error: "Error updating employee" }), {
      status: 500,
    });
  }
}
export async function DELETE(request, { params }) {
  const employeeId = params.employeeId;
  try {
    // ลบ employee ตาม id ที่รับมา
    const deletedEmployee = await prisma.employees.delete({
      where: { id: Number(employeeId) }, // แปลง id เป็นตัวเลขหากจำเป็น
    });
    console.log("deletedEmployee : ", deletedEmployee);
    // คืนค่าข้อมูล employee ที่ถูกลบ
    return new Response(
      JSON.stringify({ message: "Employee deleted", deletedEmployee }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting employee:", error);
    return new Response(JSON.stringify({ error: "Error deleting employee" }), {
      status: 500,
    });
  }
}
