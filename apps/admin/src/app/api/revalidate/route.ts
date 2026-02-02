import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { tag } = await request.json();
    revalidateTag(tag, {
      expire: 0,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Revalidate error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    );
  }
}
