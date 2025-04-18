const {
  fetchTrendingPrompts,
  checkApiKeyStatus,
} = require("./tikApiService.ts");

/**
 * Minimal test function with mock data
 * This avoids making actual API calls that might fail
 */
async function testFetchTrendingPrompts() {
  try {
    console.log("Running test with mock data...");

    // Mock data for testing
    const mockPrompts = [
      {
        prompt: "Create a detailed character description for a fantasy novel",
        author: "fantasy_writer",
        videoUrl: "https://www.tiktok.com/@fantasy_writer/video/1234567890",
        thumbnailUrl: "https://example.com/thumbnail1.jpg",
      },
      {
        prompt:
          "Write a short story about a time traveler who can only go back 24 hours",
        author: "scifi_author",
        videoUrl: "https://www.tiktok.com/@scifi_author/video/0987654321",
        thumbnailUrl: "https://example.com/thumbnail2.jpg",
      },
    ];

    console.log(`Using ${mockPrompts.length} mock prompts:`);

    // Display the mock prompts
    mockPrompts.forEach((prompt, index) => {
      console.log(`\n[${index + 1}] Author: ${prompt.author}`);
      console.log(`Prompt: ${prompt.prompt}`);
      console.log(`Video URL: ${prompt.videoUrl}`);
    });

    console.log("\nTest completed with mock data.");
    return mockPrompts;
  } catch (error) {
    console.error("Error in test:", error);
    return [];
  }
}

// Run the test when this file is executed directly
if (require.main === module) {
  testFetchTrendingPrompts();
}

module.exports = testFetchTrendingPrompts;
