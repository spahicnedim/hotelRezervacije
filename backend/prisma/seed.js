const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const hashedUserPassword = await bcrypt.hash("user123", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      username: "admin",
      password: hashedAdminPassword,
      role: "STAFF",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      username: "user",
      password: hashedUserPassword,
      role: "GUEST",
    },
  });

  console.log("Admin i korisnik su uspješno kreirani!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
