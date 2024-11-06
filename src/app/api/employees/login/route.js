import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const payload = await req.json();
    const { gmail, password } = payload;

    // Find user by email
    const employee = await prisma.employees.findFirst({
      where: { email: gmail },
    });

    if (!employee) {
      return new Response(JSON.stringify({ error: "employee not found" }), {
        status: 401,
      });
    }

    // Directly compare passwords (plain text)
    if (password !== employee.password) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        employeeId: employee.id,
        email: employee.email,
        position: employee.position,
        name: employee.name,
      },
      process.env.JWT_SECRET, // Store a secret in .env
      { expiresIn: "1h" }
    );

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
