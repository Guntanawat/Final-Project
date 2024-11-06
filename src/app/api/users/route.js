import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const employees = await prisma.users.findMany(); // ตรวจสอบชื่อตารางและวิธีการเรียกใช้งาน
    return Response.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return Response.json(
      { error: "Error fetching employees" },
      { status: 500 }
    );
  }
}
