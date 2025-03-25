import { Prompt } from "../types/prompt";

export const examplePrompts: Prompt[] = [
  {
    id: "1",
    title: "Creative Writing Assistant",
    description:
      "A versatile writing companion that helps with story development, character creation, and plot structuring. Perfect for novelists and creative writers.",
    promptText:
      "I want you to act as a creative writing assistant. Help me develop a story with compelling characters and an engaging plot.",
    tags: ["writing", "creative", "storytelling"],
    category: "Writing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "low",
  },
  {
    id: "2",
    title: "Product Description Generator",
    promptText:
      "Act as a product description writer. Create compelling copy that highlights key features and benefits while maintaining an engaging tone.",
    tags: ["ecommerce", "marketing", "copywriting"],
    category: "Marketing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "low",
  },
  {
    id: "3",
    title: "Code Review Expert",
    promptText: "Act as a senior software engineer reviewing code...",
    tags: ["code-review", "development"],
    category: "Development",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "4",
    title: "Social Media Content Calendar",
    description:
      "Create engaging social media content calendars with post ideas, hashtags, and optimal posting times for maximum engagement.",
    promptText: "Plan social media content...",
    tags: ["social-media", "content"],
    category: "Marketing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "low",
  },
  {
    id: "5",
    title: "UI/UX Design Feedback",
    promptText: "Analyze this UI/UX design...",
    tags: ["design", "feedback"],
    category: "Design",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "6",
    title: "Recipe Creator",
    promptText: "Create a recipe for...",
    tags: ["cooking", "recipes"],
    category: "Lifestyle",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "low",
  },
  {
    id: "7",
    title: "Technical Documentation Writer",
    promptText: "Create technical documentation for...",
    tags: ["documentation", "technical-writing"],
    category: "Development",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "8",
    title: "Email Marketing Campaign Assistant",
    description:
      "Craft engaging email marketing campaigns with compelling subject lines, body content, and calls-to-action that drive conversions.",
    promptText: "Help me write an email campaign...",
    tags: ["email", "marketing"],
    category: "Marketing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "9",
    title: "SEO Content Optimizer",
    promptText: "Optimize this content for SEO...",
    tags: ["seo", "content"],
    category: "Marketing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "10",
    title: "Personal Fitness Plan Generator",
    promptText: "Generate a fitness plan...",
    tags: ["fitness", "health"],
    category: "Lifestyle",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "low",
  },
  {
    id: "11",
    title: "Data Analysis Report Generator",
    promptText:
      "Act as a data analyst. Help me create an insightful report with visualizations and key findings from my data.",
    tags: ["data-analysis", "reporting", "business"],
    category: "Business",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "12",
    title: "Language Learning Conversation Partner",
    description:
      "Practice conversations in multiple languages with natural dialogue and cultural context. Includes grammar corrections and vocabulary suggestions.",
    promptText:
      "Act as a language learning partner. Help me practice conversations with natural dialogue, grammar corrections, and vocabulary suggestions.",
    tags: ["language-learning", "education", "conversation"],
    category: "Education",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "low",
  },
  {
    id: "13",
    title: "Interview Preparation Coach",
    promptText:
      "Help prepare for job interviews with common questions and industry-specific scenarios.",
    tags: ["career", "interview", "coaching"],
    category: "Career",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "14",
    title: "Business Plan Writer",
    description:
      "Create comprehensive business plans with market analysis, financial projections, and strategic planning.",
    promptText: "Help me write a business plan for my startup.",
    tags: ["business", "planning", "startup"],
    category: "Business",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "high",
  },
  {
    id: "15",
    title: "Legal Document Analyzer",
    promptText: "Review and explain legal documents in simple terms.",
    tags: ["legal", "analysis", "documents"],
    category: "Legal",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "high",
  },
  {
    id: "16",
    title: "Video Script Writer",
    description:
      "Create engaging video scripts for various platforms including YouTube, TikTok, and Instagram.",
    promptText: "Write a script for a YouTube video about...",
    tags: ["video", "content", "scripting"],
    category: "Content",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "17",
    title: "Research Paper Assistant",
    promptText: "Help with academic research paper structure and citations.",
    tags: ["academic", "research", "writing"],
    category: "Education",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "high",
  },
  {
    id: "18",
    title: "Social Media Bio Generator",
    promptText: "Create catchy and professional social media bios.",
    tags: ["social-media", "profile", "branding"],
    category: "Marketing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "low",
  },
  {
    id: "19",
    title: "Product Launch Strategist",
    description:
      "Develop comprehensive product launch strategies including marketing, PR, and sales tactics.",
    promptText: "Help me plan a product launch strategy.",
    tags: ["marketing", "launch", "strategy"],
    category: "Business",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "high",
  },
  {
    id: "20",
    title: "Resume Optimizer",
    promptText:
      "Improve resume content and formatting for specific job applications.",
    tags: ["career", "resume", "job-search"],
    category: "Career",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "21",
    title: "Podcast Script Writer",
    promptText: "Create engaging podcast scripts and show notes.",
    tags: ["podcast", "content", "audio"],
    category: "Content",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "22",
    title: "Financial Planning Assistant",
    description:
      "Get personalized financial advice and planning strategies for various life stages.",
    promptText: "Help me create a financial plan for...",
    tags: ["finance", "planning", "money"],
    category: "Finance",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "high",
  },
  {
    id: "23",
    title: "Travel Itinerary Planner",
    promptText:
      "Create detailed travel itineraries with activities and recommendations.",
    tags: ["travel", "planning", "itinerary"],
    category: "Lifestyle",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "low",
  },
  {
    id: "24",
    title: "Book Summary Generator",
    promptText: "Create concise summaries of books with key takeaways.",
    tags: ["books", "summary", "learning"],
    category: "Education",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "25",
    title: "Wedding Planner Assistant",
    description:
      "Comprehensive wedding planning assistance including timelines, checklists, and vendor coordination.",
    promptText: "Help me plan my wedding...",
    tags: ["wedding", "planning", "events"],
    category: "Events",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "26",
    title: "Meditation Guide Writer",
    promptText: "Create guided meditation scripts for various purposes.",
    tags: ["meditation", "wellness", "mindfulness"],
    category: "Health",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "low",
  },
  {
    id: "27",
    title: "Grant Proposal Writer",
    description:
      "Write compelling grant proposals for nonprofits and research projects.",
    promptText: "Help me write a grant proposal for...",
    tags: ["grants", "nonprofit", "writing"],
    category: "Business",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "high",
  },
  {
    id: "28",
    title: "App Store Listing Optimizer",
    promptText:
      "Optimize app store descriptions and metadata for better visibility.",
    tags: ["app-store", "marketing", "mobile"],
    category: "Marketing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
  {
    id: "29",
    title: "Course Curriculum Designer",
    promptText: "Design structured course curriculums for various subjects.",
    tags: ["education", "curriculum", "teaching"],
    category: "Education",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "high",
  },
  {
    id: "30",
    title: "Brand Voice Developer",
    description:
      "Create consistent brand voice guidelines and content examples.",
    promptText: "Help me develop a brand voice for...",
    tags: ["branding", "marketing", "voice"],
    category: "Marketing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "medium",
  },
];
