import { db } from "./index.js";
import { users } from "./schema.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  try {
    const passwordHash = await bcrypt.hash("chanfm09", 10);

    const guruEmail = "muhammadfc44@gmail.com";

    // Insert Guru
    await db
      .insert(users)
      .values({
        name: "Muhammad Fathurozi Chan",
        email: guruEmail,
        passwordHash,
        role: "GURU",
        status: "APPROVED",
      })
      .onConflictDoNothing({ target: users.email });

    console.log("Seeding completed successfully!");
    console.log(`Guru email: ${guruEmail}`);
    console.log("Guru password: chanfm09");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

main();
