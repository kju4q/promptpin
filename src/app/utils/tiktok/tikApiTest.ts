import TikAPI from "tikapi";

// Initialize TikAPI SDK
const tikApi = TikAPI("your-api-key");

// Log the available methods on the tikApi object
console.log("TikAPI methods:", Object.keys(tikApi));

// Try to access the post method
console.log("Post method:", tikApi.post);

// Try to access the user method
console.log("User method:", tikApi.user);

// Export the tikApi object for inspection
export default tikApi;
