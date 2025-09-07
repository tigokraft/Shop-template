import { prisma } from "@/lib/prisma";
import { hash } from "argon2";

async function main() {
  const email = "test@example.com";
  const password = await hash("password");
  await prisma.account.upsert({
    where: { email },
    update: {},
    create: { email, password },
  });
  console.log("✅ test user ready");
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
