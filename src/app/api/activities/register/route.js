import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityParticipants, activities, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";

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
    const body = await request.json();
    const { activityId } = body;
    let { userId } = body;

    if (!activityId) {
      return NextResponse.json(
        { success: false, message: "Missing activityId" },
        { status: 400 }
      );
    }

    // Identify target user ID. If user is Siswa, they can only register themselves.
    if (session.role === "SISWA") {
      userId = session.id;
    } else if (session.role === "GURU") {
      // Guru must specify which student to register
      if (!userId) {
        return NextResponse.json(
          { success: false, message: "Guru must specify a student userId" },
          { status: 400 }
        );
      }
    }

    // Verify activity exists
    const targetActivity = await db.query.activities.findFirst({
      where: eq(activities.id, Number(activityId)),
    });

    if (!targetActivity) {
      return NextResponse.json(
        { success: false, message: "Activity not found" },
        { status: 404 }
      );
    }

    // If registering user is SISWA, verify if attendance is open
    if (session.role === "SISWA" && !targetActivity.attendanceOpen) {
      return NextResponse.json(
        { success: false, message: "Absensi untuk kegiatan ini belum dibuka atau sudah ditutup." },
        { status: 400 }
      );
    }

    // Verify student exists
    const targetUser = await db.query.users.findFirst({
      where: and(eq(users.id, Number(userId)), eq(users.role, "SISWA")),
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // Check duplicate registration
    const existingRegistration = await db.query.activityParticipants.findFirst({
      where: and(
        eq(activityParticipants.activityId, Number(activityId)),
        eq(activityParticipants.userId, Number(userId))
      ),
    });

    if (existingRegistration) {
      return NextResponse.json(
        { success: false, message: "Student is already registered for this activity." },
        { status: 400 }
      );
    }

    // Insert registration record in junction table
    const [registration] = await db
      .insert(activityParticipants)
      .values({
        activityId: Number(activityId),
        userId: Number(userId),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Successfully registered for the activity!",
      registration,
    });
  } catch (error) {
    console.error("Activity registration error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during activity registration.", error: error.message },
      { status: 500 }
    );
  }
}
