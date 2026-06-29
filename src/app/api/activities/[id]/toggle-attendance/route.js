import { NextResponse } from "next/server";
import { db } from "@/db";
import { activities, users } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(request, { params }) {
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

    // Verify user is GURU or KETUA
    const admin = await db.query.users.findFirst({
      where: and(
        eq(users.email, session.email),
        or(eq(users.role, "GURU"), eq(users.role, "KETUA"))
      ),
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const activityId = parseInt(id, 10);
    if (isNaN(activityId)) {
      return NextResponse.json({ success: false, message: "Invalid ID." }, { status: 400 });
    }

    const body = await request.json();
    const { attendanceOpen } = body;

    const [updated] = await db
      .update(activities)
      .set({ attendanceOpen })
      .where(eq(activities.id, activityId))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, message: "Activity not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Absensi berhasil ${attendanceOpen ? "dibuka" : "ditutup"}.`,
      activity: updated,
    });
  } catch (error) {
    console.error("Toggle attendance error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during toggling attendance.", error: error.message },
      { status: 500 }
    );
  }
}
