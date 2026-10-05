import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminSession } from "@/lib/server-auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

interface ImgBBResponse {
  success?: boolean;
  data?: { url?: string; display_url?: string };
  error?: { message?: string };
}

export async function POST(request: NextRequest) {
  const session = await getFirebaseAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json(
      { success: false, error: "Authentication is required to upload images." },
      { status: 401 }
    );
  }
  if (!session.admin) {
    return NextResponse.json(
      { success: false, error: "Admin permission is required to upload images." },
      { status: 403 }
    );
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    console.error("ImgBB upload configuration is incomplete.");
    return NextResponse.json(
      { success: false, error: "Image upload service is not configured." },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid upload request." },
      { status: 400 }
    );
  }

  const image = formData.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json(
      { success: false, error: "Please select an image to upload." },
      { status: 400 }
    );
  }

  if (!ACCEPTED_IMAGE_TYPES.has(image.type)) {
    return NextResponse.json(
      { success: false, error: "Unsupported image format. Use JPG, PNG, WebP, or GIF." },
      { status: 400 }
    );
  }

  if (image.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { success: false, error: "Image must be smaller than 10 MB." },
      { status: 413 }
    );
  }

  try {
    const uploadData = new FormData();
    uploadData.append("key", apiKey);
    uploadData.append("image", image, image.name);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      cache: "no-store",
      body: uploadData,
    });
    const responseText = await response.text();

    let result: ImgBBResponse;
    try {
      result = JSON.parse(responseText) as ImgBBResponse;
    } catch {
      console.error("ImgBB returned a non-JSON response.", { status: response.status });
      return NextResponse.json(
        { success: false, error: "Image service returned an invalid response." },
        { status: 500 }
      );
    }

    if (!response.ok || !result.success) {
      console.error("ImgBB upload failed.", { status: response.status, error: result.error?.message });
      return NextResponse.json(
        { success: false, error: result.error?.message || "Image upload service rejected the image." },
        { status: 500 }
      );
    }

    const url = result.data?.display_url || result.data?.url;
    if (!url) {
      console.error("ImgBB upload response did not include an image URL.");
      return NextResponse.json(
        { success: false, error: "Image service did not return an image URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("ImgBB upload request failed:", error);
    return NextResponse.json(
      { success: false, error: "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}
