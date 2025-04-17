const { fetchTrendingPrompts } = require("./tikApiService");

/**
 * Test function to verify that fetchTrendingPrompts works correctly
 */
async function testFetchTrendingPrompts() {
  try {
    console.log("Fetching trending prompts...");
    const prompts = await fetchTrendingPrompts();

    console.log(`Found ${prompts.length} prompts:`);
    prompts.forEach((prompt, index) => {
      console.log(`\n[${index + 1}] Author: ${prompt.author}`);
      console.log(`Prompt: ${prompt.prompt}`);
      console.log(`Video URL: ${prompt.videoUrl}`);
    });
  } catch (error) {
    console.error("Error testing fetchTrendingPrompts:", error);
  }
}

// Run the test when this file is executed directly
if (require.main === module) {
  testFetchTrendingPrompts();
}

module.exports = testFetchTrendingPrompts;
