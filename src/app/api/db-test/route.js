import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  try {
    // Attempt to query the database
    const allUsers = await db.select().from(users);
    return NextResponse.json({
      success: true,
      message: "Connected to Neon Database successfully!",
      data: allUsers,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to Neon Database.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
