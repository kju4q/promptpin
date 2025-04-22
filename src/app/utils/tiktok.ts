import axios from "axios";
import { rewriteFallbackPrompt } from "./openai";
import {
  TIKAPI_BASE_URL,
  TIKAPI_KEY,
  TIKAPI_ACCOUNT_KEY,
  SubtitleInfo,
  TextExtra,
  ExtractedPrompt,
  TikTokComment,
} from "./tiktok-config";

// Low-signal terms to filter out
const lowSignalTerms = [
  "ugc",
  "fyp",
  "viral",
  "reels",
  "inspo",
  "influencer",
  "microinfluencer",
];

// Common adverbs to filter out
const adverbs = [
  "very",
  "really",
  "quite",
  "rather",
  "too",
  "so",
  "much",
  "many",
  "more",
  "most",
  "less",
  "least",
  "well",
  "better",
  "best",
  "badly",
  "worse",
  "worst",
  "fast",
  "faster",
  "fastest",
  "slow",
  "slower",
  "slowest",
  "early",
  "earlier",
  "earliest",
  "late",
  "later",
  "latest",
  "hard",
  "harder",
  "hardest",
  "easy",
  "easier",
  "easiest",
  "high",
  "higher",
  "highest",
  "low",
  "lower",
  "lowest",
  "near",
  "nearer",
  "nearest",
  "far",
  "farther",
  "farthest",
  "deep",
  "deeper",
  "deepest",
  "wide",
  "wider",
  "widest",
  "long",
  "longer",
  "longest",
  "short",
  "shorter",
  "shortest",
  "big",
  "bigger",
  "biggest",
  "small",
  "smaller",
  "smallest",
  "good",
  "better",
  "best",
  "bad",
  "worse",
  "worst",
  "little",
  "less",
  "least",
  "few",
  "fewer",
  "fewest",
  "many",
  "more",
  "most",
  "much",
  "more",
  "most",
];

// Common function words to filter out
const functionWords = [
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "nor",
  "for",
  "yet",
  "so",
  "at",
  "by",
  "for",
  "from",
  "in",
  "into",
  "of",
  "on",
  "to",
  "with",
  "as",
  "about",
  "after",
  "against",
  "between",
  "during",
  "through",
  "throughout",
  "toward",
  "towards",
  "within",
  "without",
  "according",
  "along",
  "amid",
  "among",
  "around",
  "before",
  "behind",
  "below",
  "beneath",
  "beside",
  "besides",
  "between",
  "beyond",
  "despite",
  "down",
  "during",
  "except",
  "inside",
  "outside",
  "since",
  "through",
  "throughout",
  "toward",
  "towards",
  "under",
  "underneath",
  "until",
  "up",
  "upon",
  "within",
  "without",
];

/**
 * Clean WebVTT content by removing timestamps and other non-text elements
 */
export function cleanWebVTTContent(content: string): string {
  // Remove WebVTT header and metadata
  let cleaned = content.replace(/WEBVTT\n/, "").replace(/^\d+\n/, "");

  // Remove timestamps and other non-text elements
  cleaned = cleaned.replace(
    /\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\n/g,
    ""
  );
  cleaned = cleaned.replace(/<c\.[^>]*>/g, "");
  cleaned = cleaned.replace(/<\/c>/g, "");

  // Remove empty lines and trim
  cleaned = cleaned
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join(" ")
    .trim();

  // Remove dangling sentence fragments
  cleaned = cleaned.replace(/[^.!?]+$/, "");

  return cleaned;
}

/**
 * Check if a prompt is clean (no hashtags, no low-signal terms)
 */
export function isCleanPrompt(prompt: string): boolean {
  // Check for hashtags
  if (prompt.includes("#")) {
    return false;
  }

  // Check for low-signal terms
  const promptLower = prompt.toLowerCase();
  for (const term of lowSignalTerms) {
    if (promptLower.includes(term)) {
      return false;
    }
  }

  return true;
}

/**
 * Check if a video has AI-related hashtags
 */
export function hasAIPromptsInHashtags(textExtra: TextExtra[]): boolean {
  const aiRelatedTerms = [
    "ai",
    "artificial intelligence",
    "chatgpt",
    "gpt",
    "openai",
    "prompt",
    "prompts",
    "prompting",
    "prompt engineering",
    "ai prompt",
    "ai prompts",
    "ai prompting",
    "ai prompt engineering",
  ];

  return textExtra.some((item) => {
    if (item.type === 1 && item.hashtagName) {
      const hashtag = item.hashtagName.toLowerCase();
      return aiRelatedTerms.some((term) => hashtag.includes(term));
    }
    return false;
  });
}

/**
 * Check if a video is AI prompt related
 */
export function isAIPromptRelated(video: any): boolean {
  // Check description
  const description = (video.desc || video.text || "").toLowerCase();
  const aiTerms = [
    "ai",
    "artificial intelligence",
    "chatgpt",
    "gpt",
    "openai",
    "prompt",
    "prompts",
    "prompting",
    "prompt engineering",
  ];

  if (aiTerms.some((term) => description.includes(term))) {
    return true;
  }

  // Check hashtags
  if (video.textExtra && hasAIPromptsInHashtags(video.textExtra)) {
    return true;
  }

  return false;
}

/**
 * Generate a creative prompt from text
 */
export async function generateCreativePrompt(text: string): Promise<string> {
  // Extract key concepts from text
  const words = text.toLowerCase().split(/\s+/);
  const keyWords = words.filter((word) => {
    // Filter out words that:
    // 1. Start with #
    // 2. Are in low-signal terms list
    // 3. Are in adverbs list
    // 4. Are in function words list
    // 5. Are less than 3 characters
    return (
      !word.startsWith("#") &&
      !lowSignalTerms.includes(word) &&
      !adverbs.includes(word) &&
      !functionWords.includes(word) &&
      word.length >= 3
    );
  });

  // Take top 5 unique keywords
  const uniqueKeywords = [...new Set(keyWords)].slice(0, 5);

  // Generate prompt using OpenAI
  const prompt = await rewriteFallbackPrompt(uniqueKeywords.join(" "));

  return prompt;
}

/**
 * Check if a prompt is action-oriented
 */
export function isActionPrompt(prompt: string): boolean {
  // Check for action verbs at the start of the prompt
  const actionVerbs = [
    "use",
    "create",
    "generate",
    "build",
    "make",
    "design",
    "develop",
    "implement",
    "construct",
    "form",
    "establish",
    "set up",
    "put together",
    "assemble",
    "compose",
    "craft",
    "fashion",
    "forge",
    "frame",
    "prepare",
    "produce",
    "shape",
    "structure",
  ];

  const promptLower = prompt.toLowerCase();
  return actionVerbs.some((verb) => promptLower.startsWith(verb));
}

/**
 * Extract a clean prompt from text
 */
export function extractCleanPrompt(text: string): string | null {
  // Remove URLs
  let cleaned = text.replace(/https?:\/\/\S+/g, "");

  // Remove hashtags and their content
  cleaned = cleaned.replace(/#\w+/g, "");

  // Remove mentions
  cleaned = cleaned.replace(/@\w+/g, "");

  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // Check if the cleaned text is a valid prompt
  if (
    cleaned.length > 10 &&
    isCleanPrompt(cleaned) &&
    isActionPrompt(cleaned)
  ) {
    return cleaned;
  }

  return null;
}

/**
 * Process a comment to extract a prompt
 */
export function processComment(comment: TikTokComment): ExtractedPrompt | null {
  const prompt = extractCleanPrompt(comment.text);

  if (prompt) {
    return {
      prompt,
      author: comment.author.nickname || comment.author.uniqueId,
      videoUrl: "", // Comment doesn't have video URL
      thumbnailUrl: "", // Comment doesn't have thumbnail
      digg_count: comment.digg_count,
    };
  }

  return null;
}

/**
 * Fetch comments for a video
 */
export async function fetchVideoComments(
  videoId: string
): Promise<TikTokComment[]> {
  if (!TIKAPI_KEY || !TIKAPI_ACCOUNT_KEY) {
    throw new Error("TikAPI keys not configured");
  }

  try {
    const response = await axios.get(`${TIKAPI_BASE_URL}/video/comments`, {
      params: { video_id: videoId, count: 50 },
      headers: {
        "X-API-KEY": TIKAPI_KEY,
        "X-ACCOUNT-KEY": TIKAPI_ACCOUNT_KEY,
        Accept: "application/json",
      },
    });

    return response.data.comments || [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

/**
 * Extract prompt from a video
 */
export async function extractPromptFromVideo(
  video: any
): Promise<ExtractedPrompt | null> {
  // Try to extract prompt from description
  const descriptionPrompt = extractCleanPrompt(video.desc || video.text || "");

  if (descriptionPrompt) {
    return {
      prompt: descriptionPrompt,
      author: video.author.nickname || video.author.uniqueId,
      videoUrl:
        video.video.playAddr || video.video.downloadAddr || video.video.play,
      thumbnailUrl: video.video.cover || video.video.originCover,
      digg_count: video.stats?.diggCount,
    };
  }

  // Try to extract prompt from comments
  const comments = await fetchVideoComments(video.id || video.item_id);

  for (const comment of comments) {
    const commentPrompt = processComment(comment);
    if (commentPrompt) {
      return {
        ...commentPrompt,
        videoUrl:
          video.video.playAddr || video.video.downloadAddr || video.video.play,
        thumbnailUrl: video.video.cover || video.video.originCover,
      };
    }
  }

  return null;
}

/**
 * Fetch trending TikTok posts and extract prompt-like text
 */
export async function fetchTrendingPrompts(): Promise<ExtractedPrompt[]> {
  if (!TIKAPI_KEY || !TIKAPI_ACCOUNT_KEY) {
    throw new Error("TikAPI keys not configured");
  }

  try {
    // Use the explore endpoint to get trending videos
    const response = await axios.get(`${TIKAPI_BASE_URL}/user/explore`, {
      params: { count: 20 }, // Increased count to get more potential prompts
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
    const skippedVideos: any[] = []; // Store videos with AI hashtags but no prompt found

    // Filter videos with AI-related hashtags upfront
    const aiRelevantVideos = videos.filter((video: any) => {
      return video?.textExtra ? hasAIPromptsInHashtags(video.textExtra) : false;
    });

    console.log(
      `Found ${aiRelevantVideos.length} AI-relevant videos out of ${videos.length} total videos`
    );

    for (const video of aiRelevantVideos) {
      const result = await extractPromptFromVideo(video);

      if (result) {
        extractedPrompts.push(result);
      } else {
        // If no prompt found but video has AI hashtags, try to generate a creative prompt
        const hasAIPrompts = video?.textExtra
          ? hasAIPromptsInHashtags(video.textExtra)
          : false;

        if (hasAIPrompts) {
          // Try to generate a creative prompt from video description or captions
          let sourceText = "";

          // Try to get text from description
          const descriptionText = video?.desc || video?.text || "";
          if (descriptionText) {
            sourceText = descriptionText;
          }

          // If no description, try to get text from captions
          if (!sourceText && video?.video?.subtitleInfos?.length > 0) {
            try {
              const englishCaptions = video.video.subtitleInfos.find(
                (subtitle: SubtitleInfo) =>
                  subtitle.LanguageCodeName === "eng-US"
              );

              if (englishCaptions?.Url) {
                const captionsResponse = await axios.get(englishCaptions.Url);
                sourceText = cleanWebVTTContent(captionsResponse.data);
              }
            } catch (error) {
              console.error(
                "Error processing captions for creative prompt:",
                error
              );
            }
          }

          // If we have source text, generate a creative prompt
          if (sourceText) {
            const creativePrompt = await generateCreativePrompt(sourceText);

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

            extractedPrompts.push({
              prompt: creativePrompt,
              creativeTitle: creativePrompt,
              author: authorInfo,
              videoUrl: videoInfo.url,
              thumbnailUrl: videoInfo.thumbnail,
            });

            console.log(
              `Generated creative prompt for video with AI hashtags: ${creativePrompt}`
            );
          } else {
            // Log skipped video for later analysis
            skippedVideos.push({
              id: video?.id || video?.item_id,
              hashtags: video?.textExtra
                ?.filter((item: TextExtra) => item?.type === 1)
                .map((item: TextExtra) => item?.hashtagName)
                .filter(Boolean),
              description: video?.desc || video?.text || "",
              author:
                video?.author?.nickname || video?.author?.uniqueId || "Unknown",
            });

            console.log(
              `Skipped video with AI hashtags but no prompt found: ${
                video?.id || video?.item_id
              }`
            );
          }
        }
      }
    }

    // Log summary of skipped videos
    if (skippedVideos.length > 0) {
      console.log(
        `Skipped ${skippedVideos.length} videos with AI hashtags but no prompt found:`
      );
      skippedVideos.forEach((video, index) => {
        console.log(
          `${index + 1}. Video ID: ${video.id}, Hashtags: ${video.hashtags.join(
            ", "
          )}`
        );
      });
    }

    // Filter out duplicate prompts
    const uniquePrompts = extractedPrompts.reduce(
      (acc: ExtractedPrompt[], current: ExtractedPrompt) => {
        // Check if this prompt already exists in our accumulator
        const isDuplicate = acc.some(
          (item) =>
            item.prompt.toLowerCase().trim() ===
            current.prompt.toLowerCase().trim()
        );

        if (!isDuplicate) {
          acc.push(current);
        } else {
          console.log(`Filtered out duplicate prompt: ${current.prompt}`);
        }

        return acc;
      },
      []
    );

    console.log(
      `Filtered out ${
        extractedPrompts.length - uniquePrompts.length
      } duplicate prompts`
    );

    // Sort prompts by relevance (using digg_count if available)
    const sortedPrompts = uniquePrompts.sort((a, b) => {
      // If both have digg_count, sort by that
      if (a.digg_count !== undefined && b.digg_count !== undefined) {
        return b.digg_count - a.digg_count; // Sort in descending order
      }

      // If only one has digg_count, prioritize the one with digg_count
      if (a.digg_count !== undefined) return -1;
      if (b.digg_count !== undefined) return 1;

      // If neither has digg_count, maintain original order
      return 0;
    });

    return sortedPrompts;
  } catch (error: any) {
    console.error("Error fetching trending prompts:", error);
    throw new Error(`Failed to fetch trending prompts: ${error.message}`);
  }
}
