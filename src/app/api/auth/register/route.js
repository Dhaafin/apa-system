import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, class: className } = body;

    // Validation
    if (!name || !email || !password || !className) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, email, password, class" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        role: "SISWA",
        status: "PENDING",
        class: className,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        class: users.class,
      });

    return NextResponse.json({
      success: true,
      message: "Registration successful! Waiting for teacher approval.",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during registration.", error: error.message },
      { status: 500 }
    );
  }
}
