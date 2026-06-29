import { NextResponse } from "next/server";
import { db } from "@/db";
import { activities, activityParticipants } from "@/db/schema";
import { users } from "@/db/schema";
import { eq, and, or, sql } from "drizzle-orm";
import { cookies } from "next/headers";

// Fetch all activities
export async function GET() {
  try {
    // Get all activities and count of participants
    const allActivities = await db
      .select({
        id: activities.id,
        name: activities.name,
        description: activities.description,
        imageUrl: activities.imageUrl,
        date: activities.date,
        createdAt: activities.createdAt,
        participantCount: sql`count(${activityParticipants.userId})::int`.as("participant_count"),
      })
      .from(activities)
      .leftJoin(activityParticipants, eq(activities.id, activityParticipants.activityId))
      .groupBy(activities.id)
      .orderBy(activities.date);

    return NextResponse.json({
      success: true,
      activities: allActivities,
    });
  } catch (error) {
    console.error("Fetch activities error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load activities.", error: error.message },
      { status: 500 }
    );
  }
}

// Create new activity (Guru or Ketua only)
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

    const body = await request.json();
    const { name, description, imageUrl, date } = body;

    if (!name || !description || !date) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, description, date" },
        { status: 400 }
      );
    }

    const [newActivity] = await db
      .insert(activities)
      .values({
        name,
        description,
        imageUrl: imageUrl || null,
        date: new Date(date),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Activity created successfully!",
      activity: newActivity,
    });
  } catch (error) {
    console.error("Create activity error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during activity creation.", error: error.message },
      { status: 500 }
    );
  }
}
