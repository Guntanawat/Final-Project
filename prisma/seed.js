const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Delete existing employees and appointments to avoid unique constraint issues
  await prisma.appointments.deleteMany({});
  await prisma.employees.deleteMany({});

  // Seed Employees
  const employees = await prisma.employees.createMany({
    data: [
      {
        name: "Alice Barber",
        position: "Barber",
        phone_number: "0111222333", // Ensure this is unique
        email: "alice@barber.com",
        password: "hashed_password_1",
        created_at: new Date(),
      },
      {
        name: "Bob Stylist",
        position: "Stylist",
        phone_number: "0445566778", // Ensure this is unique
        email: "bob@stylist.com",
        password: "hashed_password_2",
        created_at: new Date(),
      },
    ],
  });

  // Fetch the created employees to get their IDs
  const alice = await prisma.employees.findUnique({
    where: { email: "alice@barber.com" },
  });
  const bob = await prisma.employees.findUnique({
    where: { email: "bob@stylist.com" },
  });

  // Seed Appointments
  await prisma.appointments.createMany({
    data: [
      {
        name: "John Doe",
        phone_number: "0123456789",
        employee_id: alice.id, // Use Alice's ID
        appointment_time: new Date("2024-08-15T10:00:00Z"),
        status: "pending",
        created_at: new Date(),
      },
      {
        name: "Jane Doe",
        phone_number: "0987654321",
        employee_id: bob.id, // Use Bob's ID
        appointment_time: new Date("2024-08-16T14:00:00Z"),
        status: "pending",
        created_at: new Date(),
      },
    ],
  });

  console.log("Seed data has been inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
