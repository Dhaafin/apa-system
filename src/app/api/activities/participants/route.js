import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityParticipants, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get("activityId");

    if (!activityId) {
      return NextResponse.json(
        { success: false, message: "Missing activityId query parameter" },
        { status: 400 }
      );
    }

    // Get all registered students with profile details
    const list = await db
      .select({
        id: activityParticipants.id,
        status: activityParticipants.status,
        registeredAt: activityParticipants.registeredAt,
        student: {
          id: users.id,
          name: users.name,
          email: users.email,
          class: users.class,
        },
      })
      .from(activityParticipants)
      .innerJoin(users, eq(activityParticipants.userId, users.id))
      .where(eq(activityParticipants.activityId, Number(activityId)))
      .orderBy(users.name);

    return NextResponse.json({
      success: true,
      participants: list,
    });
  } catch (error) {
    console.error("Fetch participants error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load participants list.", error: error.message },
      { status: 500 }
    );
  }
}
