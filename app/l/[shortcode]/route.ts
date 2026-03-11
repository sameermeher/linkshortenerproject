import { getLinkByShortCode } from "@/data/links";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;
  if (!/^[a-zA-Z0-9_-]{1,50}$/.test(shortcode)) {
    return NextResponse.json({ error: "Invalid short code" }, { status: 400 });
  }
  const link = await getLinkByShortCode(shortcode);

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.redirect(link.originalUrl, { status: 301 });
}
