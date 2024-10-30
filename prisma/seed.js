const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Delete existing employees and appointments to avoid unique constraint issues
  await prisma.appointments.deleteMany({});
  await prisma.employees.deleteMany({});

  // Seed Employees
  const alice = await prisma.employees.create({
    data: {
      name: "Alice Barber",
      position: "Barber",
      phone_number: "0111222333", // Ensure this is unique
      email: "alice@barber.com",
      password: "hashed_password_1",
      created_at: new Date(),
    },
  });

  const bob = await prisma.employees.create({
    data: {
      name: "Bob Stylist",
      position: "Stylist",
      phone_number: "0445566778", // Ensure this is unique
      email: "bob@stylist.com",
      password: "hashed_password_2",
      created_at: new Date(),
    },
  });

  // เพิ่มข้อมูลพนักงานเพิ่มเติม
  const charlie = await prisma.employees.create({
    data: {
      name: "Charlie Manager",
      position: "Manager",
      phone_number: "0999888777", // Ensure this is unique
      email: "charlie@manager.com",
      password: "hashed_password_3",
      created_at: new Date(),
    },
  });

  const diana = await prisma.employees.create({
    data: {
      name: "Diana Cleaner",
      position: "Cleaner",
      phone_number: "0888777666", // Ensure this is unique
      email: "diana@cleaner.com",
      password: "hashed_password_4",
      created_at: new Date(),
    },
  });

  const edward = await prisma.employees.create({
    data: {
      name: "Edward Receptionist",
      position: "Receptionist",
      phone_number: "0777666555", // Ensure this is unique
      email: "edward@receptionist.com",
      password: "hashed_password_5",
      created_at: new Date(),
    },
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
