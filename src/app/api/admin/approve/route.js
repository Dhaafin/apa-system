import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request) {
  try {
    const body = await request.json();
    const { studentId, action, adminEmail } = body;

    // Validation
    if (!studentId || !action || !adminEmail) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: studentId, action, adminEmail" },
        { status: 400 }
      );
    }

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        { success: false, message: "Invalid action. Must be APPROVE or REJECT" },
        { status: 400 }
      );
    }

    // Verify admin/teacher authority
    const admin = await db.query.users.findFirst({
      where: and(eq(users.email, adminEmail), eq(users.role, "GURU")),
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin email is not registered as a GURU." },
        { status: 403 }
      );
    }

    // Find student
    const student = await db.query.users.findFirst({
      where: and(eq(users.id, Number(studentId)), eq(users.role, "SISWA")),
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // Map action to status
    const targetStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";

    // Update status
    const [updatedStudent] = await db
      .update(users)
      .set({ status: targetStatus })
      .where(eq(users.id, Number(studentId)))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        class: users.class,
      });

    return NextResponse.json({
      success: true,
      message: `Student status updated to ${targetStatus} successfully!`,
      user: updatedStudent,
    });
  } catch (error) {
    console.error("Approval flow error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during approval flow.", error: error.message },
      { status: 500 }
    );
  }
}
