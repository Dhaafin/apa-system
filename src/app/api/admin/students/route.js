import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);

    // Verify requesting user is GURU
    const admin = await db.query.users.findFirst({
      where: and(eq(users.email, session.email), eq(users.role, "GURU")),
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    // Fetch all student records
    const students = await db.query.users.findMany({
      where: eq(users.role, "SISWA"),
    });

    // Compute stats
    const stats = {
      total: students.length,
      pending: students.filter((s) => s.status === "PENDING").length,
      approved: students.filter((s) => s.status === "APPROVED").length,
      rejected: students.filter((s) => s.status === "REJECTED").length,
    };

    return NextResponse.json({
      success: true,
      students,
      stats,
    });
  } catch (error) {
    console.error("Fetch students error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load student directory." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);

    // Verify requesting user is GURU
    const admin = await db.query.users.findFirst({
      where: and(eq(users.email, session.email), eq(users.role, "GURU")),
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, className } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar." },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user (auto approved since created by GURU)
    const newUser = await db.insert(users).values({
      name,
      email,
      passwordHash,
      role: "SISWA",
      status: "APPROVED",
      class: className || null,
    }).returning();

    return NextResponse.json({
      success: true,
      message: "Anggota baru berhasil dibuat.",
      user: newUser[0],
    });
  } catch (error) {
    console.error("Create student error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal membuat anggota baru." },
      { status: 500 }
    );
  }
}
