import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !url.startsWith("https://maps.googleapis.com/")) {
    return NextResponse.json({ error: "Invalid or missing URL" }, { status: 400 });
  }
  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 });
  }
} 