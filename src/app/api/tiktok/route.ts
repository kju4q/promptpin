import { NextRequest, NextResponse } from "next/server";
import { fetchTrendingPrompts } from "../../utils/tiktok";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "trending"; // Default to trending

  try {
    // For now, we're only handling trending prompts
    const prompts = await fetchTrendingPrompts();
    console.log("Fetched prompts:", prompts);
    return NextResponse.json({ prompts });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch trending prompts",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
