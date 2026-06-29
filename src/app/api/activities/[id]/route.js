import { NextResponse } from "next/server";
import { db } from "@/db";
import { activities, users } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { cookies } from "next/headers";

async function getAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie) return null;

  const session = JSON.parse(sessionCookie.value);
  const admin = await db.query.users.findFirst({
    where: and(
      eq(users.email, session.email),
      or(eq(users.role, "GURU"), eq(users.role, "KETUA"))
    ),
  });
  return admin || null;
}

// Update an activity (Guru only)
export async function PUT(request, { params }) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized or forbidden." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const activityId = parseInt(id, 10);
    if (isNaN(activityId)) {
      return NextResponse.json({ success: false, message: "Invalid ID." }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, imageUrl, date, isExpedition } = body;

    if (!name || !description || !date) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, description, date" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(activities)
      .set({
        name,
        description,
        imageUrl: imageUrl || null,
        date: new Date(date),
        isExpedition: !!isExpedition,
      })
      .where(eq(activities.id, activityId))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, message: "Activity not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Acara berhasil diperbarui.",
      activity: updated,
    });
  } catch (error) {
    console.error("Update activity error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during update.", error: error.message },
      { status: 500 }
    );
  }
}

// Delete an activity (Guru only)
export async function DELETE(request, { params }) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized or forbidden." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const activityId = parseInt(id, 10);
    if (isNaN(activityId)) {
      return NextResponse.json({ success: false, message: "Invalid ID." }, { status: 400 });
    }

    const [deleted] = await db
      .delete(activities)
      .where(eq(activities.id, activityId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Activity not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Acara berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete activity error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during deletion.", error: error.message },
      { status: 500 }
    );
  }
}
