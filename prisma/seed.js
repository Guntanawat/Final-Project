const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Delete existing employees and appointments to avoid unique constraint issues
  await prisma.appointments.deleteMany({});
  await prisma.employees.deleteMany({});
  await prisma.users.deleteMany({});

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

  const user = await prisma.users.create({
    data: {
      name: "John Doe",
      phone_number: "0999888777", // Ensure this is unique
      email: "johnd2d.doe@example.com",
      password: "hashed_password_1", // Use a hashed password
      created_at: new Date(),
      role: "member", // Default role
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
  // ✅ ลบ createMany() และใช้ create() แทน
  await prisma.appointments.create({
    data: {
      name: "John Doe",
      phone_number: "0123456789",
      appointment_time: new Date("2024-08-15T10:00:00Z"),
      status: "pending",
      created_at: new Date(),
      employee: { connect: { id: alice.id } }, // ✅ เชื่อมกับ employee
      user: { connect: { id: user.id } }, // ✅ เชื่อมกับ user
    },
  });

  await prisma.appointments.create({
    data: {
      name: "Jane Doe",
      phone_number: "0987654321",
      appointment_time: new Date("2024-08-16T14:00:00Z"),
      status: "pending",
      created_at: new Date(),
      employee: { connect: { id: bob.id } },
      user: { connect: { id: user.id } },
    },
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
