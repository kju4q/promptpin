import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { rewriteFallbackPrompt } from "../../utils/openai";

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
  digg_count?: number;
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
    .replace(/^WEBVTT.*$/m, "")
    .replace(/^\d{2}:\d{2}:\d{2}\.\d{3}.*$/gm, "")
    .replace(/^NOTE.*$/gm, "")
    .replace(/^-->.*$/gm, "")
    .replace(/^\d+$/gm, "")
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

  // Remove dangling sentence fragments
  // 1. Remove fragments that start with 's ', "'s ", "is ", or " — "
  result = result.replace(/\b(s\s+|'s\s+|is\s+|—\s+)([a-z])/gi, "$2");

  // 2. Remove fragments that start mid-word (like "s that you can use")
  result = result.replace(/\b(s\w+)\s+/gi, "");

  // 3. Remove common TikTok footer text
  result = result.replace(
    /\s*(follow for more|like and subscribe|check out my|follow me|follow for|like for|comment|share|save|follow|subscribe|link in bio|tools of choice).*$/gi,
    ""
  );

  // 4. Remove fragments that don't start with a capital letter (likely mid-sentence)
  const sentences = result.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const validSentences = sentences.filter((s) => {
    const trimmed = s.trim();
    return (
      trimmed.length > 0 &&
      (trimmed[0] === trimmed[0].toUpperCase() || /^["'""]/.test(trimmed))
    ); // Allow sentences starting with quotes
  });

  result = validSentences.join(". ").trim();

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
 * Check if hashtags contain AI-related terms
 */
function hasAIPromptsInHashtags(textExtra: TextExtra[]): boolean {
  const aiHashtags = [
    "chatgpt",
    "chatgptprompts",
    "ai",
    "aiprompts",
    "gpt",
    "gptprompts",
    "promptengineering",
    "prompt",
    "prompts",
  ];

  return textExtra.some((item) => {
    if (item.type === 1 && item.hashtagName) {
      const hashtag = item.hashtagName.toLowerCase().replace("#", "");
      return aiHashtags.some((aiTag) => hashtag.includes(aiTag));
    }
    return false;
  });
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
    "#chatgpt",
    "#chatgptprompts",
    "#ai",
    "#aiprompts",
    "#gpt",
    "#gptprompts",
    "#promptengineering",
    "#prompt",
    "#prompts",
  ];

  const textLower = text.toLowerCase();
  return aiKeywords.some((keyword) => textLower.includes(keyword));
}

/**
 * Generate a creative AI-focused prompt from longer text
 */
async function generateCreativePrompt(text: string): Promise<string> {
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

  // Low-signal terms to filter out
  const lowSignalTerms = [
    "ugc",
    "fyp",
    "viral",
    "reels",
    "inspo",
    "influencer",
    "microinfluencer",
    "creator",
    "tiktok",
    "trend",
    "marketing",
    "algorithm",
  ];

  // Common adverbs to filter out - minimal list
  const adverbs = [
    "simply",
    "sometimes",
    "definitely",
    "probably",
    "maybe",
    "usually",
    "often",
    "rarely",
    "never",
    "always",
    "generally",
    "mostly",
    "completely",
    "entirely",
    "totally",
    "absolutely",
    "relatively",
    "almost",
    "nearly",
    "quite",
    "rather",
    "somewhat",
    "slightly",
    "just",
    "only",
    "merely",
    "basically",
    "primarily",
    "mainly",
  ];

  // Common function words to filter out - minimal list
  const functionWords = [
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
    "to",
    "of",
    "in",
    "on",
    "at",
    "by",
    "about",
    "between",
    "into",
    "through",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "not",
    "only",
    "same",
    "so",
    "than",
    "too",
    "very",
    "can",
    "will",
    "just",
    "should",
    "now",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "would",
    "could",
    "should",
    "might",
    "must",
    "don't",
    "can't",
    "won't",
  ];

  // Extract key concepts from the text
  const words = text.toLowerCase().split(/\s+/);
  const keyWords = words.filter(
    (word) =>
      word.length > 3 &&
      !word.startsWith("#") &&
      !lowSignalTerms.includes(word) &&
      !adverbs.includes(word) &&
      !functionWords.includes(word) &&
      !["ai", "gpt", "chatgpt", "prompt", "prompts"].includes(word) &&
      // Ensure the word is a noun or verb (not an adverb or adjective)
      /^[a-z]+$/.test(word) && // Only letters, no numbers or special characters
      !word.endsWith("ly") // Filter out most adverbs
  );

  // If we don't have enough good keywords, use a fallback
  if (keyWords.length === 0) {
    // Try to find action verbs or nouns from the text
    const actionVerbs = [
      "write",
      "create",
      "generate",
      "develop",
      "design",
      "build",
      "make",
      "produce",
      "craft",
      "compose",
      "draft",
      "formulate",
    ];
    const nouns = [
      "content",
      "document",
      "report",
      "article",
      "essay",
      "story",
      "script",
      "outline",
      "summary",
      "analysis",
      "review",
      "guide",
    ];

    // Try to find any action verb or noun in the text
    for (const word of words) {
      if (actionVerbs.includes(word) || nouns.includes(word)) {
        keyWords.push(word);
      }
    }

    // If still no keywords, use a default
    if (keyWords.length === 0) {
      keyWords.push("content");
    }
  }

  // Create a creative prompt
  const starter = starters[Math.floor(Math.random() * starters.length)];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  const keyConcept =
    keyWords[Math.floor(Math.random() * keyWords.length)] || "content";

  const rawPrompt = `${starter} ${keyConcept} ${ending}`;

  // Use GPT to rewrite the fallback prompt to make it more usable
  try {
    return await rewriteFallbackPrompt(rawPrompt);
  } catch (error) {
    console.error("Error rewriting fallback prompt:", error);
    return rawPrompt; // Fall back to the original prompt if there's an error
  }
}

/**
 * Check if text is a valid action-oriented prompt with specific outcome
 */
function isActionPrompt(text: string): boolean {
  // Action verbs that indicate a prompt - reduced list
  const actionVerbs = [
    "write",
    "ask",
    "generate",
    "create",
    "make",
    "tell",
    "explain",
    "describe",
    "summarize",
    "analyze",
    "compare",
    "list",
    "outline",
    "define",
    "explore",
    "research",
    "develop",
    "design",
    "build",
    "formulate",
    "compose",
    "craft",
    "prepare",
    "provide",
    "suggest",
    "recommend",
    "demonstrate",
    "show",
    "find",
    "identify",
    "organize",
    "structure",
  ];

  // Check if the text starts with an action verb
  const startsWithAction = actionVerbs.some((verb) =>
    text.toLowerCase().trim().startsWith(verb)
  );

  // Check for specific outcome indicators - simplified
  const hasSpecificOutcome =
    /in \d+ (bullet points|paragraphs|sentences|words|steps|ways|examples|reasons|points|items|lists)/i.test(
      text
    ) ||
    /that (explains|describes|summarizes|analyzes|compares|lists|outlines|defines|explores|researches|develops|designs|builds|formulates|composes|crafts|prepares|provides|suggests|recommends|demonstrates|shows|finds|identifies|organizes|structures)/i.test(
      text
    );

  return startsWithAction && hasSpecificOutcome;
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

  // 1. Check for quoted prompts first
  const quoted = text.match(/["""](.*?)["""]/);
  if (quoted && isCleanPrompt(quoted[1])) {
    console.log("Found quoted prompt:", quoted[1]);
    return quoted[1].trim();
  }

  // 2. Look for common prompt indicators with regex
  const promptIndicators = [
    "prompt(?::|s+to)?",
    "say this to chatgpt",
    "try this",
    "ask chatgpt to",
    "tell chatgpt",
    "copy paste this into gpt",
    "i asked chatgpt to",
    "chatgpt wrote this when i said",
    "say this to ai",
    "my favorite prompt",
    "prompt that changed my life",
    "ai prompt that changed my life",
    "chatgpt prompt that changed my life",
    "gpt prompt that changed my life",
  ];

  for (const indicator of promptIndicators) {
    const regex = new RegExp(`(?:${indicator}):?\\s*(.*)`, "i");
    const match = text.match(regex);

    if (match && match[1]) {
      const extractedText = match[1].trim();
      console.log(
        `Found prompt using indicator "${indicator}":`,
        extractedText
      );

      // Clean up the extracted text
      const cleanedText = extractedText
        .replace(/follow for more.*$/i, "")
        .replace(/like and subscribe.*$/i, "")
        .replace(/check out my.*$/i, "")
        .trim();

      if (isCleanPrompt(cleanedText)) {
        return cleanedText;
      }
    }
  }

  // 3. If no specific indicators found, try to extract meaningful content
  // Look for sentences that might be prompts
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  for (const sentence of sentences) {
    const cleanedSentence = sentence.trim();
    if (isCleanPrompt(cleanedSentence) && isAIPromptRelated(cleanedSentence)) {
      console.log("Found prompt in sentence:", cleanedSentence);
      return cleanedSentence;
    }
  }

  // 4. Final validation layer - check if it's an action-oriented prompt with specific outcome
  if (isActionPrompt(text)) {
    console.log("Found action-oriented prompt:", text);
    return text;
  }

  return "";
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

    // Check if video has AI-related hashtags
    const hasAIPrompts = video?.textExtra
      ? hasAIPromptsInHashtags(video.textExtra)
      : false;
    console.log("Has AI-related hashtags:", hasAIPrompts);

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

    // 2. If no prompt in captions or if video has AI hashtags, try description and hashtags
    if (!promptText || hasAIPrompts) {
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

    // 3. If still no prompt or if video has AI hashtags, try comments
    if (!promptText || hasAIPrompts) {
      try {
        const videoId = video?.id || video?.item_id;
        if (videoId) {
          const comments = await fetchVideoComments(videoId);
          console.log(`\n=== Processing Comments for Video ${videoId} ===`);
          console.log(`Found ${comments.length} comments`);

          // Process comments
          let maxDiggCount = 0;
          for (const comment of comments) {
            console.log("\n=== Processing Comment ===");
            console.log("Raw comment text:", comment.text);
            console.log("Comment author:", comment.user?.nickname);

            const extractedPrompt = extractCleanPrompt(comment.text);
            console.log("Extracted prompt:", extractedPrompt);

            if (extractedPrompt) {
              console.log("✅ Valid prompt found in comment");
              promptText = extractedPrompt;
              source = "comments";
              // Track the highest digg_count from comments
              maxDiggCount = Math.max(maxDiggCount, comment.digg_count || 0);
              break;
            } else {
              console.log("❌ No valid prompt found in comment");
            }
          }

          // If we found a prompt from comments, include the digg_count
          if (promptText && source === "comments") {
            return {
              prompt: promptText,
              creativeTitle: promptText,
              author: authorInfo,
              videoUrl: videoInfo.url,
              thumbnailUrl: videoInfo.thumbnail,
              digg_count: maxDiggCount > 0 ? maxDiggCount : undefined,
            };
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
