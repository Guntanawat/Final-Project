import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function GET(request, { params }) {
  return Response.json({
    message: `Hello from /api/${params.employeeId}`,
  });
}

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
