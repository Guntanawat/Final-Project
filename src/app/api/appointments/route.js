import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appointments = await prisma.appointments.findMany({
      include: {
        employee: true, // Include the employee data associated with each appointment
      },
    });
    return Response.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return Response.json(
      { error: "Error fetching appointments" },
      { status: 500 }
    );
  }
}
