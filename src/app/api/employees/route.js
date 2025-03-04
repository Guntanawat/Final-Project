import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const count = searchParams.get("count") === "true"; // เช็คว่าค่า count เป็น "true" หรือไม่
    if (count) {
      // ดึงจำนวนพนักงานที่ไม่ใช่แอดมิน พร้อมนับจำนวนการนัดหมายของแต่ละคน
      const employeesWithAppointmentCount = await prisma.employees.findMany({
        where: { position: { not: "admin" } },
        select: {
          id: true,
          name: true,
          position: true,
          _count: {
            select: { appointments: true }, // นับจำนวนการนัดหมายของพนักงานแต่ละคน
          },
        },
      });

      return Response.json({ employees: employeesWithAppointmentCount });
    }

    // ดึงข้อมูลพนักงานทั้งหมด (ยกเว้น admin)
    const employees = await prisma.employees.findMany({
      where: {
        position: {
          not: "admin",
        },
      },
    });

    return Response.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return Response.json(
      { error: "Error fetching employees" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    // รับข้อมูลจาก request body
    const payload = await req.json();

    // ตรวจสอบว่ามีข้อมูลจำเป็นครบถ้วน
    const { name, position, phone_number, email, password } = payload;

    if (!name || !position || !phone_number || !email || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // ใช้ Prisma ในการสร้าง employee ใหม่
    const newEmployee = await prisma.employees.create({
      data: {
        name,
        position,
        phone_number,
        email,
        password,
      },
    });

    // ส่งข้อมูล employee ที่ถูกสร้างกลับไปเป็น response
    return new Response(JSON.stringify(newEmployee), {
      status: 201, // Created
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    return new Response(JSON.stringify({ error: "Error creating employee" }), {
      status: 500,
    });
  }
}
