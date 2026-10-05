import { NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";

const UPLOAD_PRESET = "ap-pulse";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Cloudinary signature API is working.",
  });
}

export async function POST() {
  try {
    console.log("=================================");
    console.log("Cloudinary signature API called");
    console.log("=================================");

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log("Cloudinary cloud name exists:", !!cloudName);
    console.log("Cloudinary API key exists:", !!apiKey);
    console.log("Cloudinary API secret exists:", !!apiSecret);

    // ---------------------------------------------------------
    // Check environment variables
    // ---------------------------------------------------------

    if (!cloudName) {
      console.error("CLOUDINARY_CLOUD_NAME is missing.");

      return NextResponse.json(
        {
          success: false,
          error: "CLOUDINARY_CLOUD_NAME is missing from .env.local",
        },
        { status: 500 }
      );
    }

    if (!apiKey) {
      console.error("CLOUDINARY_API_KEY is missing.");

      return NextResponse.json(
        {
          success: false,
          error: "CLOUDINARY_API_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    if (!apiSecret) {
      console.error("CLOUDINARY_API_SECRET is missing.");

      return NextResponse.json(
        {
          success: false,
          error: "CLOUDINARY_API_SECRET is missing from .env.local",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // Create timestamp
    // ---------------------------------------------------------

    const timestamp = Math.floor(Date.now() / 1000);

    // ---------------------------------------------------------
    // Parameters that Cloudinary will verify
    // ---------------------------------------------------------

    const paramsToSign =
      `timestamp=${timestamp}&upload_preset=${UPLOAD_PRESET}`;

    console.log("Parameters being signed:");
    console.log(paramsToSign);

    // ---------------------------------------------------------
    // Generate SHA-1 signature
    // ---------------------------------------------------------

    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    console.log("Signature generated successfully.");

    // ---------------------------------------------------------
    // Return JSON to browser
    // ---------------------------------------------------------

    return NextResponse.json({
      success: true,
      cloudName,
      apiKey,
      timestamp,
      signature,
      uploadPreset: UPLOAD_PRESET,
    });
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "Cloudinary signature API crashed:"
    );

    console.error(error);

    console.error(
      "================================="
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      { status: 500 }
    );
  }
}