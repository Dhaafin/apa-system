import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing email or password" },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check approval status
    if (user.role === "SISWA" && user.status !== "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          message: `Your account is ${user.status.toLowerCase()}. Please wait for Guru's approval.`,
        },
        { status: 403 }
      );
    }

    // Set cookie session (mock token)
    const cookieStore = await cookies();
    const sessionData = JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    
    cookieStore.set("session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during login.", error: error.message },
      { status: 500 }
    );
  }
}
