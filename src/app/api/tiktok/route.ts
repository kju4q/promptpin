import { NextRequest, NextResponse } from "next/server";
import { fetchTrendingPrompts } from "../../utils/tiktok";
import { TIKAPI_KEY, TIKAPI_ACCOUNT_KEY } from "../../utils/tiktok-config";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "trending"; // Default to trending

  // Check if API keys are configured
  if (!TIKAPI_KEY || !TIKAPI_ACCOUNT_KEY) {
    console.error("TikAPI keys not configured:", {
      TIKAPI_KEY: TIKAPI_KEY ? "defined" : "undefined",
      TIKAPI_ACCOUNT_KEY: TIKAPI_ACCOUNT_KEY ? "defined" : "undefined",
    });
    return NextResponse.json(
      {
        error: "TikAPI keys not configured",
        message:
          "Please configure your TikTok API keys in the environment variables",
      },
      { status: 500 }
    );
  }

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
