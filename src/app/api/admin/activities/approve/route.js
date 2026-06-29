import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityParticipants, users } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
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
    const { participantId, action } = body; // action is "APPROVE" or "REJECT"

    if (!participantId || !action) {
      return NextResponse.json(
        { success: false, message: "Missing participantId or action" },
        { status: 400 }
      );
    }

    const dbStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";

    // Update status in junction table
    const [updated] = await db
      .update(activityParticipants)
      .set({ status: dbStatus })
      .where(eq(activityParticipants.id, Number(participantId)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Registration record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Kehadiran peserta berhasil di-${action.toLowerCase()}`,
      updated,
    });
  } catch (error) {
    console.error("Approve participant error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during participant approval.", error: error.message },
      { status: 500 }
    );
  }
}
