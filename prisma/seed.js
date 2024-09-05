const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.employee.createMany({
    data: [
      {
        name: "John Doe",
        position: "Barber",
        phone_number: "123-456-7890",
        email: "john@example.com",
        password: "password123",
        role: "employee",
      },
      {
        name: "Jane Smith",
        position: "Stylist",
        phone_number: "987-654-3210",
        email: "jane@example.com",
        password: "password123",
        role: "employee",
      },
    ],
  });

  await prisma.appointment.createMany({
    data: [
      {
        name: "Customer A",
        phone_number: "111-222-3333",
        employee_id: 1,
        appointment_time: new Date(),
        status: "pending",
      },
      {
        name: "Customer B",
        phone_number: "444-555-6666",
        employee_id: 2,
        appointment_time: new Date(),
        status: "confirmed",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
