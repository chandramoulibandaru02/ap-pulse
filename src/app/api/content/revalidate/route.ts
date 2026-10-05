import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminSession } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  const session = await getFirebaseAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  }
  if (!session.admin) {
    return NextResponse.json({ error: "Admin permission is required." }, { status: 403 });
  }

  revalidatePath("/");
  revalidatePath("/latest");
  revalidatePath("/category/[slug]", "page");
  revalidatePath("/district/[slug]", "page");
  revalidatePath("/news/[slug]", "page");
  revalidatePath("/rss.xml");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ revalidated: true });
}
