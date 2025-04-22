import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for demo purposes, use server-side API calls in production
});

export interface OpenAIPrompt {
  id: string;
  title: string;
  promptText: string;
  exampleOutput: string;
  category: string;
  keywords: string[];
}

// Helper function to extract JSON from OpenAI response
function extractJsonFromResponse(responseContent: string): string {
  let jsonContent = responseContent;

  // If response contains markdown code blocks, extract the JSON content
  if (responseContent.includes("```")) {
    // Extract content between the code blocks
    const match = responseContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match && match[1]) {
      jsonContent = match[1].trim();
    }
  }

  return jsonContent;
}

// Helper function to generate a consistent ID
function generateId(prefix: string, timestamp: number, index?: number): string {
  const cleanPrefix = prefix.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return index !== undefined
    ? `ai-${cleanPrefix}-${timestamp}-${index + 1}`
    : `ai-${cleanPrefix}-${timestamp}`;
}

// Helper function to make OpenAI API calls
async function makeOpenAICall(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    temperature: 0.7,
  });

  const responseContent = completion.choices[0]?.message?.content;
  if (!responseContent) {
    throw new Error("No response from OpenAI");
  }

  return responseContent;
}

// Function to generate a prompt based on a topic or category
export async function generatePrompt(topic: string): Promise<OpenAIPrompt> {
  try {
    const systemPrompt =
      "You are a helpful assistant that generates AI prompts based on topics.";
    const userPrompt = `Create an AI prompt related to ${topic}. Return it in this JSON format without any other text:
    {
      "title": "A catchy title for the prompt",
      "promptText": "The detailed prompt text that would be sent to an AI",
      "exampleOutput": "An example of what the AI might output for this prompt",
      "category": "One of: Business, Development, Marketing, Design, Content, Data, Education, Entertainment, Lifestyle, Professional",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }`;

    const responseContent = await makeOpenAICall(systemPrompt, userPrompt);
    const jsonContent = extractJsonFromResponse(responseContent);
    const promptData = JSON.parse(jsonContent) as Omit<OpenAIPrompt, "id">;

    const timestamp = Date.now();
    const id = generateId(topic, timestamp);

    return {
      id,
      ...promptData,
    };
  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
}

// Function to generate multiple prompts for a category
export async function generatePromptsForCategory(
  category: string,
  count: number = 3
): Promise<OpenAIPrompt[]> {
  try {
    const systemPrompt =
      "You are a helpful assistant that generates multiple AI prompts based on categories.";
    const userPrompt = `Create ${count} AI prompts related to the ${category} category. Return them in this JSON format without any other text:
    [
      {
        "title": "A catchy title for the prompt",
        "promptText": "The detailed prompt text that would be sent to an AI",
        "exampleOutput": "An example of what the AI might output for this prompt",
        "category": "${category}",
        "keywords": ["keyword1", "keyword2", "keyword3"]
      },
      ...
    ]`;

    const responseContent = await makeOpenAICall(systemPrompt, userPrompt);
    const jsonContent = extractJsonFromResponse(responseContent);
    const promptsData = JSON.parse(jsonContent) as Omit<OpenAIPrompt, "id">[];

    const timestamp = Date.now();

    return promptsData.map((prompt, index) => ({
      id: generateId(category, timestamp, index),
      ...prompt,
    }));
  } catch (error) {
    console.error("Error generating prompts for category:", error);
    throw error;
  }
}

// Function to enhance an existing prompt with suggestions
export async function enhancePrompt(promptText: string): Promise<string> {
  try {
    const systemPrompt =
      "You are a helpful assistant that enhances AI prompts to make them more effective.";
    const userPrompt = `Enhance this AI prompt to make it more effective, detailed, and likely to produce better results:
    "${promptText}"
    
    Return only the enhanced prompt text without any additional commentary.`;

    const responseContent = await makeOpenAICall(systemPrompt, userPrompt);
    return responseContent.trim();
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    throw error;
  }
}

// Function to rewrite a fallback prompt to make it more usable
export async function rewriteFallbackPrompt(
  fallbackPrompt: string
): Promise<string> {
  try {
    const systemPrompt = `You are a helpful assistant that rewrites AI prompts to make them more usable and effective.
Your task is to take a potentially nonsensical or poorly formed prompt and transform it into something that a user could actually paste into ChatGPT or Claude.
Focus on:
1. Making the prompt clear and actionable
2. Ensuring it has a specific purpose or outcome
3. Removing any nonsensical elements
4. Adding context where needed
5. Making it sound natural and like something a real user would ask

Return ONLY the rewritten prompt without any explanations or additional text.`;

    const userPrompt = `Rewrite this fallback prompt into a usable prompt someone could paste into ChatGPT or Claude:
"${fallbackPrompt}"`;

    const responseContent = await makeOpenAICall(systemPrompt, userPrompt);
    return responseContent.trim();
  } catch (error) {
    console.error("Error rewriting fallback prompt:", error);
    // Return the original prompt if there's an error
    return fallbackPrompt;
  }
}
