import { NextRequest, NextResponse } from "next/server";
import { fetchTrendingPrompts } from "@/app/utils/tiktok/tikApiService";

export async function GET(req: NextRequest) {
  try {
    const prompts = await fetchTrendingPrompts();
    return NextResponse.json({ prompts }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching trending prompts:", error);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
