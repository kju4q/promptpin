import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const TIKAPI_BASE_URL = "https://api.tikapi.io/public";
const TIKAPI_KEY = process.env.NEXT_PUBLIC_TIKAPI_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hashtag = searchParams.get("hashtag");
  const count = searchParams.get("count") || "5";

  if (!TIKAPI_KEY) {
    return NextResponse.json(
      { error: "TikAPI key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(
      `${TIKAPI_BASE_URL}/hashtag/${encodeURIComponent(
        hashtag as string
      )}/feed`,
      {
        params: { count },
        headers: {
          Accept: "application/json",
          "X-TikAPI-Key": TIKAPI_KEY,
        },
        timeout: 10000,
      }
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
