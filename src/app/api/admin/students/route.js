import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";

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
