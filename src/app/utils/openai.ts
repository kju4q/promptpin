import OpenAI from "openai";

// Initialize the OpenAI client
// Note: The API key should be stored in an environment variable in production
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

// Function to generate a prompt based on a topic or category
export async function generatePrompt(topic: string): Promise<OpenAIPrompt> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates AI prompts based on topics.",
        },
        {
          role: "user",
          content: `Create an AI prompt related to ${topic}. Return it in this JSON format without any other text:
          {
            "title": "A catchy title for the prompt",
            "promptText": "The detailed prompt text that would be sent to an AI",
            "exampleOutput": "An example of what the AI might output for this prompt",
            "category": "One of: Business, Development, Marketing, Design, Content, Data, Education, Entertainment, Lifestyle, Professional",
            "keywords": ["keyword1", "keyword2", "keyword3"]
          }`,
        },
      ],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    // Extract JSON from the response, handling potential code blocks
    let jsonContent = responseContent;

    // If response contains markdown code blocks, extract the JSON content
    if (responseContent.includes("```")) {
      // Extract content between the code blocks
      const match = responseContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match && match[1]) {
        jsonContent = match[1].trim();
      }
    }

    // Parse the clean JSON response
    const promptData = JSON.parse(jsonContent) as Omit<OpenAIPrompt, "id">;

    // Generate a more consistent ID based on topic and timestamp
    const cleanTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const timestamp = Date.now();
    const id = `ai-${cleanTopic}-${timestamp}`;

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
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates multiple AI prompts based on categories.",
        },
        {
          role: "user",
          content: `Create ${count} AI prompts related to the ${category} category. Return them in this JSON format without any other text:
          [
            {
              "title": "A catchy title for the prompt",
              "promptText": "The detailed prompt text that would be sent to an AI",
              "exampleOutput": "An example of what the AI might output for this prompt",
              "category": "${category}",
              "keywords": ["keyword1", "keyword2", "keyword3"]
            },
            ...
          ]`,
        },
      ],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    // Extract JSON from the response, handling potential code blocks
    let jsonContent = responseContent;

    // If response contains markdown code blocks, extract the JSON content
    if (responseContent.includes("```")) {
      // Extract content between the code blocks
      const match = responseContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match && match[1]) {
        jsonContent = match[1].trim();
      }
    }

    // Parse the clean JSON response
    const promptsData = JSON.parse(jsonContent) as Omit<OpenAIPrompt, "id">[];

    // Add IDs to each prompt
    const cleanCategory = category.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const timestamp = Date.now();

    return promptsData.map((prompt, index) => ({
      id: `ai-${cleanCategory}-${timestamp}-${index + 1}`,
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
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that enhances AI prompts to make them more effective.",
        },
        {
          role: "user",
          content: `Enhance this AI prompt to make it more effective, detailed, and likely to produce better results:
          "${promptText}"
          
          Return only the enhanced prompt text without any additional commentary.`,
        },
      ],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    return responseContent.trim();
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    throw error;
  }
}
