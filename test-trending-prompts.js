// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

// Configure ts-node with test configuration
require("ts-node").register({
  project: "./tsconfig.test.json",
});

// This script runs the testFetchTrendingPrompts function
const testFetchTrendingPrompts = require("./src/app/utils/tiktok/testTrendingPrompts");

// Run the test
testFetchTrendingPrompts()
  .then(() => {
    console.log("Test completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
