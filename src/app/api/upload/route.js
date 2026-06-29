import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename") || "activity-image.jpg";

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { success: false, message: "Vercel Blob token is not configured on the server." },
        { status: 500 }
      );
    }

    // Read the binary body stream
    const fileBlob = await request.blob();

    // Upload to Vercel Blob
    const blobResult = await put(filename, fileBlob, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      url: blobResult.url,
    });
  } catch (error) {
    console.error("Vercel Blob upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed", error: error.message },
      { status: 500 }
    );
  }
}
