import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const TIKAPI_BASE_URL = "https://api.tikapi.io";
const TIKAPI_KEY = process.env.NEXT_PUBLIC_TIKAPI_KEY;
const TIKAPI_ACCOUNT_KEY = process.env.TIKAPI_ACCOUNT_KEY;

interface SubtitleInfo {
  LanguageCodeName: string;
  Url: string;
}

interface TextExtra {
  type: number;
  hashtagName?: string;
}

interface ExtractedPrompt {
  prompt: string;
  creativeTitle: string;
  author: string;
  videoUrl: string;
  thumbnailUrl: string;
}

interface TikTokComment {
  text: string;
  digg_count: number;
  user: {
    nickname: string;
    unique_id: string;
  };
  comment_language: string;
}

/**
 * Clean and summarize transcript-like content
 */
function cleanWebVTTContent(content: string): string {
  if (typeof content !== "string") {
    console.log("Invalid content type:", typeof content);
    return "";
  }

  // Remove WEBVTT header and metadata
  let cleaned = content
    .replace(/^WEBVTT.*$/m, "") // Remove WEBVTT header
    .replace(/^\d{2}:\d{2}:\d{2}\.\d{3}.*$/gm, "") // Remove timestamp lines
    .replace(/^NOTE.*$/gm, "") // Remove NOTE lines
    .replace(/^-->.*$/gm, "") // Remove arrow lines
    .replace(/^\d+$/gm, "") // Remove standalone numbers
    .replace(/\n{3,}/g, "\n\n") // Replace multiple newlines with double newline
    .trim();

  // Split into lines and filter out empty ones
  const lines = cleaned.split("\n").filter((line) => line.trim());

  // Clean up common transcript issues
  const cleanedLines = lines.map((line) => {
    return (
      line
        // Remove filler words and stutters
        .replace(/\b(um|uh|er|ah|like|you know|sort of|kind of)\b/gi, "")
        // Remove repeated words (e.g., "the the", "and and")
        .replace(/\b(\w+)(?:\s+\1\b)+/gi, "$1")
        // Remove repeated punctuation
        .replace(/([.,!?])\1+/g, "$1")
        // Clean up spaces
        .replace(/\s+/g, " ")
        .trim()
    );
  });

  // Join lines and clean up spaces
  let result = cleanedLines.join(" ").replace(/\s+/g, " ").trim();

  // If the result is too long, try to extract the most meaningful part
  if (result.length > 500) {
    // Look for key phrases that might indicate the main content
    const keyPhrases = [
      "here's how",
      "let me show you",
      "the key is",
      "the secret",
      "the trick",
      "what you need to know",
      "here's what",
      "the best way",
      "pro tip",
      "expert tip",
    ];

    for (const phrase of keyPhrases) {
      const index = result.toLowerCase().indexOf(phrase);
      if (index !== -1) {
        // Extract 300 characters after the key phrase
        result = result.substring(index, index + 300).trim();
        break;
      }
    }

    // If no key phrase found, take the first 300 characters
    if (result.length > 500) {
      result = result.substring(0, 300).trim();
    }
  }

  return result;
}

/**
 * Check if text is a clean, short prompt
 */
function isCleanPrompt(text: string): boolean {
  // Remove common TikTok patterns first
  const cleanText = text
    .replace(/@[\w.-]+/g, "")
    .replace(/#[\w.-]+/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .trim();

  // Check if it's a meaningful phrase
  const words = cleanText.split(/\s+/);
  const isShort = words.length <= 20;
  const hasNoTikTokNoise =
    !/(follow for more|like and subscribe|check out my|follow me|follow for|like for|comment|share|save|follow|subscribe)/i.test(
      cleanText
    );

  // Check for minimum meaningful content
  const hasMinimumWords = words.length >= 3;

  return isShort && hasNoTikTokNoise && hasMinimumWords;
}

/**
 * Check if text is related to AI, ChatGPT, or prompts
 */
function isAIPromptRelated(text: string): boolean {
  const aiKeywords = [
    "ai prompt",
    "chatgpt prompt",
    "gpt prompt",
    "prompt for",
    "prompt to",
    "prompt that",
    "prompt which",
    "prompt:",
    "prompt -",
    "prompt —",
    "use this prompt",
    "try this prompt",
    "here's a prompt",
    "prompt hack",
    "prompt tip",
    "prompt trick",
    "prompt engineering",
  ];

  const textLower = text.toLowerCase();
  return aiKeywords.some((keyword) => textLower.includes(keyword));
}

/**
 * Generate a creative AI-focused prompt from longer text
 */
function generateCreativePrompt(text: string): string {
  // AI-focused creative prompt starters
  const starters = [
    "Use AI to",
    "Ask ChatGPT to",
    "Prompt GPT to",
    "Get AI to",
    "Have ChatGPT",
    "Make AI",
    "Let GPT",
    "Use this prompt to",
    "Try this AI prompt to",
    "Use this ChatGPT prompt to",
    "With this prompt, AI will",
    "This prompt makes AI",
    "This prompt helps ChatGPT",
    "This prompt enables GPT to",
  ];

  // AI-focused creative prompt endings
  const endings = [
    "and unlock new possibilities",
    "and transform your workflow",
    "and revolutionize your process",
    "and enhance your productivity",
    "and streamline your tasks",
    "and optimize your results",
    "and maximize your output",
    "and improve your efficiency",
    "and elevate your work",
    "and supercharge your creativity",
  ];

  // Extract key concepts from the text
  const words = text.toLowerCase().split(/\s+/);
  const keyWords = words.filter(
    (word) =>
      word.length > 3 &&
      ![
        "the",
        "and",
        "for",
        "that",
        "this",
        "with",
        "from",
        "your",
        "have",
        "what",
      ].includes(word) &&
      !["ai", "gpt", "chatgpt", "prompt", "prompts"].includes(word)
  );

  // Create a creative prompt
  const starter = starters[Math.floor(Math.random() * starters.length)];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  const keyConcept =
    keyWords[Math.floor(Math.random() * keyWords.length)] || "your tasks";

  return `${starter} ${keyConcept} ${ending}`;
}

/**
 * Clean and extract the actual prompt from text
 */
function extractCleanPrompt(text: string): string {
  if (typeof text !== "string") {
    console.log("Invalid text type:", typeof text);
    return "";
  }

  // First check if it's AI-related
  if (!isAIPromptRelated(text)) {
    return "";
  }

  // First check if it's already a clean prompt
  if (isCleanPrompt(text)) {
    return text.trim();
  }

  // Remove common TikTok patterns
  text = text
    .replace(/@[\w.-]+/g, "")
    .replace(/#[\w.-]+/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Look for common prompt indicators
  const promptIndicators = [
    "prompt:",
    "try this prompt:",
    "here's a prompt:",
    "prompt for",
    "ai prompt:",
    "chatgpt prompt:",
    "gpt prompt:",
    "prompt that changed my life:",
    "ai prompt that changed my life:",
    "chatgpt prompt that changed my life:",
    "gpt prompt that changed my life:",
  ];

  for (const indicator of promptIndicators) {
    const index = text.toLowerCase().indexOf(indicator);
    if (index !== -1) {
      // Extract text after the indicator
      text = text.substring(index + indicator.length).trim();
      break;
    }
  }

  // Remove any remaining non-prompt text
  text = text
    .replace(/follow for more.*$/i, "")
    .replace(/like and subscribe.*$/i, "")
    .replace(/check out my.*$/i, "")
    .trim();

  return text;
}

/**
 * Process a single comment to extract a prompt
 */
function processComment(comment: string): string | null {
  const clean = extractCleanPrompt(comment);
  return isAIPromptRelated(clean) && isCleanPrompt(clean) ? clean : null;
}

/**
 * Fetch comments for a video and extract unique prompts
 */
async function fetchVideoComments(videoId: string): Promise<TikTokComment[]> {
  try {
    console.log("Fetching comments for video:", videoId);

    const response = await axios.get(`${TIKAPI_BASE_URL}/comment/list`, {
      params: {
        media_id: videoId,
        count: 20,
        cursor: 0,
      },
      headers: {
        "X-API-KEY": TIKAPI_KEY,
        "X-ACCOUNT-KEY": TIKAPI_ACCOUNT_KEY,
        Accept: "application/json",
      },
    });

    const comments = response?.data?.comments || [];
    if (!comments.length) {
      console.log("No comments found for video:", videoId);
      return [];
    }

    // isAIPromptRelated(text) && -- remove temporarily
    // Filter and map comments to our structured format
    return comments
      .filter((comment: any) => {
        try {
          const text = comment.text || "";
          // Only include comments that are AI-related and clean prompts
          return isCleanPrompt(text);
        } catch (error) {
          console.error("Error processing comment:", error);
          return false;
        }
      })
      .map((comment: any) => ({
        text: comment.text || "",
        digg_count: comment.digg_count || 0,
        user: {
          nickname: comment.user?.nickname || "",
          unique_id: comment.user?.unique_id || "",
        },
        comment_language: comment.comment_language || "unknown",
      }));
  } catch (error: any) {
    // Check if it's a 403 error
    if (error?.response?.status === 403) {
      console.log("Comments access forbidden (403) for video:", videoId);
      return [];
    }

    // For other errors, log and return empty array
    console.error("Failed to fetch comments:", error?.message || error);
    return [];
  }
}

/**
 * Extract prompt from a video using multiple sources
 */
async function extractPromptFromVideo(
  video: any
): Promise<ExtractedPrompt | null> {
  try {
    let promptText = "";
    let source = "";

    // 1. Try captions first
    if (video?.video?.subtitleInfos?.length > 0) {
      try {
        const englishCaptions = video.video.subtitleInfos.find(
          (subtitle: SubtitleInfo) => subtitle.LanguageCodeName === "eng-US"
        );

        if (englishCaptions?.Url) {
          const captionsResponse = await axios.get(englishCaptions.Url);
          const captionText = cleanWebVTTContent(captionsResponse.data);
          const extractedPrompt = extractCleanPrompt(captionText);
          if (extractedPrompt) {
            promptText = extractedPrompt;
            source = "captions";
          }
        }
      } catch (error) {
        console.error("Error processing captions:", error);
      }
    }

    // 2. If no prompt in captions, try description and hashtags
    if (!promptText) {
      try {
        const descriptionText = video?.desc || video?.text || "";
        const hashtags =
          video?.textExtra
            ?.filter((item: TextExtra) => item?.type === 1)
            .map((item: TextExtra) => item?.hashtagName)
            .filter(Boolean)
            .join(" ") || "";

        const combinedText = `${descriptionText} ${hashtags}`;
        const extractedPrompt = extractCleanPrompt(combinedText);
        if (extractedPrompt) {
          promptText = extractedPrompt;
          source = "description_and_hashtags";
        }
      } catch (error) {
        console.error("Error processing description and hashtags:", error);
      }
    }

    // 3. If still no prompt, try comments
    if (!promptText) {
      try {
        const videoId = video?.id || video?.item_id;
        if (videoId) {
          const comments = await fetchVideoComments(videoId);
          // Sort comments by digg_count to prioritize popular comments
          const sortedComments = comments.sort(
            (a, b) => b.digg_count - a.digg_count
          );

          // Find the first comment that looks like a valid prompt
          for (const comment of sortedComments) {
            try {
              const extractedPrompt = extractCleanPrompt(comment.text);
              if (extractedPrompt) {
                promptText = extractedPrompt;
                source = "comments";
                break;
              }
            } catch (error) {
              console.error("Error processing comment:", error);
              continue;
            }
          }
        }
      } catch (error) {
        console.error("Error processing comments:", error);
      }
    }

    if (!promptText) {
      return null;
    }

    console.log(`Found prompt from ${source}:`, promptText);

    // Extract author information with fallbacks
    const authorInfo =
      video?.author?.nickname ||
      video?.author?.uniqueId ||
      video?.author?.id ||
      "Unknown";

    // Extract video URL and thumbnail with fallbacks
    const videoInfo = {
      url:
        video?.video?.playAddr ||
        video?.video?.downloadAddr ||
        video?.video?.play ||
        "",
      thumbnail: video?.video?.cover || video?.video?.originCover || "",
    };

    return {
      prompt: promptText,
      creativeTitle: promptText,
      author: authorInfo,
      videoUrl: videoInfo.url,
      thumbnailUrl: videoInfo.thumbnail,
    };
  } catch (error) {
    console.error("Error in extractPromptFromVideo:", error);
    return null;
  }
}

/**
 * Fetch trending TikTok posts and extract prompt-like text
 */
async function fetchTrendingPrompts(): Promise<ExtractedPrompt[]> {
  if (!TIKAPI_KEY || !TIKAPI_ACCOUNT_KEY) {
    throw new Error("TikAPI keys not configured");
  }

  try {
    // Use the explore endpoint to get trending videos
    const response = await axios.get(`${TIKAPI_BASE_URL}/user/explore`, {
      params: { count: 10 }, // Increased count to get more potential prompts
      headers: {
        "X-API-KEY": TIKAPI_KEY,
        "X-ACCOUNT-KEY": TIKAPI_ACCOUNT_KEY,
        Accept: "application/json",
      },
      timeout: 30000,
    });

    if (!response?.data?.itemList) {
      throw new Error("No videos found in response");
    }

    const videos = response.data.itemList;
    const extractedPrompts: ExtractedPrompt[] = [];

    for (const video of videos) {
      const result = await extractPromptFromVideo(video);
      if (result) {
        extractedPrompts.push(result);
      }
    }

    return extractedPrompts;
  } catch (error: any) {
    console.error("Error fetching trending prompts:", error);
    throw new Error(`Failed to fetch trending prompts: ${error.message}`);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "trending"; // Default to trending

  // Check if API keys are configured
  if (!TIKAPI_KEY) {
    console.error(
      "TikAPI key not configured. Please set NEXT_PUBLIC_TIKAPI_KEY environment variable."
    );
    return NextResponse.json(
      {
        error: "TikAPI key not configured",
        message:
          "Please set NEXT_PUBLIC_TIKAPI_KEY environment variable in your .env.local file",
      },
      { status: 500 }
    );
  }

  if (!TIKAPI_ACCOUNT_KEY) {
    console.error(
      "TikAPI account key not configured. Please set TIKAPI_ACCOUNT_KEY environment variable."
    );
    return NextResponse.json(
      {
        error: "TikAPI account key not configured",
        message:
          "Please set TIKAPI_ACCOUNT_KEY environment variable in your .env.local file",
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
