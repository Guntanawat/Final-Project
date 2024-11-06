import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req) {
  try {
    // รับข้อมูลจาก request body
    const payload = await req.json();

    // ตรวจสอบว่ามีข้อมูลจำเป็นครบถ้วน
    const { name, phone_number, email, password } = payload;
    const user = await prisma.users.findUnique({ where: { email: email } });
    if (!name || !phone_number || !email || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }
    if (user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 431,
      });
    }

    // ใช้ Prisma ในการสร้าง employee ใหม่
    const newEmployee = await prisma.users.create({
      data: {
        name,
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
