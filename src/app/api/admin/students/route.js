import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
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
    const { name, email, password, className, role } = body;

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
      role: ["GURU", "SISWA", "KETUA"].includes(role) ? role : "SISWA",
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

export async function PUT(request) {
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
    const { id, name, email, password, className, status, role } = body;

    if (!id || !name || !email) {
      return NextResponse.json(
        { success: false, message: "ID, nama, dan email wajib diisi." },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await db.query.users.findFirst({
      where: and(eq(users.email, email), ne(users.id, id)),
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar pada pengguna lain." },
        { status: 400 }
      );
    }

    const updateData = {
      name,
      email,
      class: className || null,
    };

    if (role && ["GURU", "SISWA", "KETUA"].includes(role)) {
      updateData.role = role;
    }

    if (status) {
      updateData.status = status;
    }

    if (password && password.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    await db.update(users).set(updateData).where(eq(users.id, id));

    return NextResponse.json({
      success: true,
      message: "Data anggota berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Update student error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data anggota." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url);
    const studentIdStr = searchParams.get("id");

    if (!studentIdStr) {
      return NextResponse.json(
        { success: false, message: "ID anggota wajib disertakan." },
        { status: 400 }
      );
    }

    const studentId = parseInt(studentIdStr, 10);

    await db.delete(users).where(eq(users.id, studentId));

    return NextResponse.json({
      success: true,
      message: "Anggota berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus anggota." },
      { status: 500 }
    );
  }
}
