export interface Prompt {
  id: string;
  title: string;
  promptText: string;
  exampleOutput: string;
  category: string;
  keywords?: string[];
  isSaved?: boolean;
}

export const examplePrompts: Prompt[] = [
  {
    id: "1",
    title: "Startup Pitch Generator",
    promptText:
      "Create a compelling 1-minute pitch for a startup that combines [technology] and [industry]. Include the problem, solution, market opportunity, and a memorable tagline.",
    exampleOutput:
      "Introducing FarmSight: where AI meets agriculture. Our drone-based computer vision system helps farmers detect crop diseases 10 days earlier than the human eye, reducing crop loss by 37% while cutting pesticide use in half. With 2.5 billion acres of global farmland and climate change threatening food security, FarmSight's subscription model delivers 3x ROI for farmers. \"See problems before they grow\" - because tomorrow's harvest depends on today's insights.",
    category: "Business",
    keywords: ["pitch", "startup", "presentation"],
  },
  {
    id: "2",
    title: "Code Refactoring Assistant",
    promptText:
      "Analyze this [programming language] code snippet and suggest refactoring improvements for better readability, performance, and adherence to best practices:\n\n```[paste code here]```",
    exampleOutput:
      "Your code has several opportunities for improvement:\n\n1. Replace the nested for-loops with Array.map() to improve readability and reduce mutation\n2. Extract the validation logic into a separate function\n3. Use destructuring for cleaner object property access\n4. Add meaningful variable names instead of single letters\n5. Consider using TypeScript interfaces for better type safety\n\nHere's the refactored version:\n\n```javascript\nconst processUserData = (users) => {\n  const isValidUser = (user) => user.age >= 18 && user.permissions.includes('edit');\n  \n  return users\n    .filter(isValidUser)\n    .map(({ id, name, preferences }) => ({\n      userId: id,\n      displayName: name.trim(),\n      theme: preferences.theme || 'default'\n    }));\n};\n```",
    category: "Development",
    keywords: ["code", "refactoring", "optimization"],
  },
  {
    id: "3",
    title: "Email Subject Line Generator",
    promptText:
      "Generate 10 compelling email subject lines for a [type of business] promoting [product/service/event]. The target audience is [target demographic] and the primary goal is to [desired action].",
    exampleOutput:
      '1. "Last Chance: 48 Hours to Transform Your Fitness Journey"\n2. "3 Workout Secrets Most Personal Trainers Won\'t Share"\n3. "[First Name], Your Custom Fitness Plan is Ready"\n4. "Skip the Gym, Not Your Workout (New Home Program)"\n5. "The 15-Minute Morning Routine with 87% Success Rate"\n6. "Feeling Stuck? This Fitness Assessment Reveals Why"\n7. "Your Neighbors Are Getting Fit With This..."\n8. "The Exercise Myth That\'s Sabotaging Your Goals"\n9. "Join 10,000+ Members Celebrating Their Results"\n10. "We Analyzed 50+ Fitness Apps (See What We Found)"',
    category: "Marketing",
    keywords: ["email", "copywriting", "subject"],
  },
  {
    id: "4",
    title: "Product Description Wizard",
    promptText:
      "Write a persuasive product description for a [product type] that highlights its [key features] and appeals to [target audience]. Include sensory details, benefits, and a call to action.",
    exampleOutput:
      "Introducing the UltraGrip Pro Hiking Boots — where rugged durability meets cloud-like comfort. \n\nEngineered with water-resistant Cordura® fabric and full-grain leather, these boots stand strong against rocky trails and unexpected downpours. The revolutionary AirCushion heel absorbs shock with each step, while our proprietary TreeGrip soles provide unmatched traction on wet and dry surfaces alike.\n\nAdventure-tested by professional guides in the Rockies, these boots feature anatomical arch support that reduces fatigue during those final challenging miles. The quick-pull lacing system adjusts with a single motion, even with gloved hands.\n\nWhether you're tackling weekend trails or planning a month-long expedition, the UltraGrip Pro boots become more comfortable with each journey. Your feet will thank you at the end of every day.\n\nAvailable in four earth-inspired colors. Free shipping on orders over $75.\n\nElevate your next adventure — your path to discovery starts with what's on your feet.",
    category: "Marketing",
    keywords: ["product", "description", "copywriting"],
  },
  {
    id: "5",
    title: "Social Media Content Calendar",
    promptText:
      "Create a 7-day social media content calendar for a [type of business] on [platform]. Include content themes, post ideas, best times to post, and relevant hashtags for each day.",
    exampleOutput:
      '# 7-Day Instagram Calendar for Sustainable Fashion Brand\n\n## Monday: Brand Values (Post at 12pm)\n* Content: Behind-the-scenes look at fabric sourcing\n* Caption: "Every thread tells a story. Our organic cotton comes from family farms practicing regenerative agriculture, healing the soil with each harvest."\n* Hashtags: #SustainableFashion #EthicalClothing #SlowFashionMovement\n\n## Tuesday: Product Spotlight (Post at 5pm)\n* Content: Carousel of new hemp-blend jacket in different settings\n* Caption: "One jacket, countless adventures. Our Everywear Hemp Blazer transitions seamlessly from morning meetings to evening gatherings."\n* Hashtags: #CapsuleWardrobe #VersatileStyle #PlantBasedFashion\n\n## Wednesday: Customer Feature (Post at 1pm)\n* Content: Repost customer styling your products\n* Caption: "Community spotlight: @username shows how she styles our Meridian Blouse for both work and weekend. Share your looks with #WearingConsciously"\n* Hashtags: #CustomerAppreciation #StyleInspiration #RealPeopleFashion\n\n## Thursday: Educational Content (Post at 7pm)\n* Content: Infographic about fabric water usage\n* Caption: "Did you know? Conventional cotton requires 20,000 liters of water to produce a single t-shirt and pair of jeans. Our recycled fabric collection reduces that by 95%."\n* Hashtags: #FashionFacts #WaterConservation #ClimateAction\n\n## Friday: Weekend Style Guide (Post at 11am)\n* Content: Short-form video styling tips\n* Caption: "3 ways to style our bestselling Flux Pants for your weekend plans. Which look is your favorite?"\n* Hashtags: #FridayFashion #WeekendStyle #SustainableCloset\n\n## Saturday: Lifestyle Content (Post at 10am)\n* Content: Flat lay of weekend essentials featuring your products\n* Caption: "Saturday essentials for mindful living. What self-care rituals are you practicing this weekend?"\n* Hashtags: #MindfulLiving #SlowLiving #WeekendVibes\n\n## Sunday: Values & Community (Post at 2pm)\n* Content: Share an environmental initiative your brand supports\n* Caption: "For every order this month, we\'re planting 5 trees in areas affected by deforestation. Together with @partnerorganization, we\'ve helped restore 15 acres of forest this year."\n* Hashtags: #GivingBack #ForestRestoration #ShopForACause',
    category: "Marketing",
    keywords: ["social media", "content", "calendar"],
  },
  {
    id: "6",
    title: "UX Improvement Analyzer",
    promptText:
      "Analyze this user flow for a [type of application] and suggest UX improvements that would enhance usability, reduce friction, and increase conversion:\n\n[Describe current user flow]",
    exampleOutput:
      '## UX Analysis of Account Creation Flow\n\n### Current Pain Points\n1. The multi-page registration process creates unnecessary abandonment points\n2. Form validation only occurs after submission, causing user frustration\n3. Password requirements are only shown after an error occurs\n4. Users must verify email before accessing any features\n5. No social login options despite target demographic preferences\n\n### Recommended Improvements\n\n#### High Impact, Low Effort:\n* Implement inline validation with real-time feedback\n* Display password requirements proactively with visual indicators\n* Add "show password" toggle to reduce input errors\n* Allow limited app exploration before requiring account completion\n\n#### High Impact, Medium Effort:\n* Condense registration to a single page with progressive disclosure\n* Add social login options (Google, Apple, Facebook)\n* Implement a progress indicator for multi-step processes\n* Offer guest checkout with option to create account later\n\n#### Data-Informed Hypotheses:\n* Reducing form fields from 9 to 5 could increase conversion by ~30%\n* Adding social login options could increase signups by 15-25%\n* Real-time validation could reduce form errors by ~60%\n\nI recommend starting with inline validation and password visibility toggle as your first optimization test.',
    category: "Design",
    keywords: ["UX", "usability", "conversion"],
  },
  {
    id: "7",
    title: "Recipe Creator",
    promptText:
      "Create a unique recipe that combines [cuisine type] and [dietary preference] cooking styles. The main ingredients should include [ingredient 1], [ingredient 2], and [ingredient 3]. Include ingredients list, preparation steps, cooking time, and serving suggestions.",
    exampleOutput:
      "# Moroccan-Inspired Cauliflower Tahini Bowls\n*Vegan, Gluten-Free | Prep: 15 min | Cook: 25 min | Serves: 4*\n\n## Ingredients\n\n### Roasted Cauliflower\n* 1 large head cauliflower, cut into florets\n* 3 tablespoons olive oil\n* 2 teaspoons cumin\n* 1 teaspoon smoked paprika\n* 1 teaspoon coriander\n* ½ teaspoon cinnamon\n* ½ teaspoon salt\n* ¼ teaspoon cayenne (optional)\n\n### Lemon-Herb Quinoa\n* 1 cup quinoa, rinsed\n* 2 cups vegetable broth\n* Zest of 1 lemon\n* 2 tablespoons fresh lemon juice\n* ⅓ cup chopped fresh mint\n* ¼ cup chopped fresh parsley\n\n### Tahini Sauce\n* ⅓ cup tahini\n* 3 tablespoons lemon juice\n* 1 garlic clove, minced\n* 3-4 tablespoons water\n* ¼ teaspoon salt\n\n### For Serving\n* 1 cup pomegranate seeds\n* ½ cup pistachios, roughly chopped\n* ¼ cup dried apricots, diced\n* Fresh mint leaves\n\n## Instructions\n\n1. Preheat oven to 425°F (220°C). Line a baking sheet with parchment paper.\n\n2. In a large bowl, toss cauliflower florets with olive oil and all spices until evenly coated. Spread in a single layer on the baking sheet. Roast for 20-25 minutes, tossing halfway, until edges are crispy and golden.\n\n3. Meanwhile, combine quinoa and vegetable broth in a saucepan. Bring to a boil, then reduce heat to low, cover, and simmer for 15 minutes until liquid is absorbed. Remove from heat and let stand, covered, for 5 minutes.\n\n4. Fluff quinoa with a fork, then stir in lemon zest, lemon juice, mint, and parsley.\n\n5. Make the tahini sauce: Whisk together tahini, lemon juice, garlic, and salt. Add water one tablespoon at a time until desired consistency is reached (should be pourable but not watery).\n\n6. Assemble bowls: Divide quinoa among four bowls. Top with roasted cauliflower, a generous drizzle of tahini sauce, pomegranate seeds, pistachios, and dried apricots.\n\n7. Garnish with additional fresh mint leaves and serve immediately.\n\n## Serving Suggestions\nServe warm or at room temperature. These bowls store well in the refrigerator for up to 3 days, making them perfect for meal prep (store tahini sauce separately).\n\n## Chef's Notes\n* For added protein, add a can of drained chickpeas to the cauliflower before roasting\n* Substitute farro or couscous for quinoa if gluten is not a concern\n* The flavor profile works beautifully with a side of preserved lemon or quick-pickled red onions",
    category: "Lifestyle",
    keywords: ["recipe", "cooking", "food"],
  },
  {
    id: "8",
    title: "Personal Bio Generator",
    promptText:
      "Write a professional bio for a [profession] who specializes in [specialty/focus area]. They want to highlight their [achievement/credential], experience with [relevant skill/experience], and approach that emphasizes [unique value proposition]. The bio will be used for [platform/purpose].",
    exampleOutput:
      "Dr. Maya Richardson combines cutting-edge neuroscience research with clinical expertise to help high-performance professionals overcome cognitive barriers and unlock their mental potential.\n\nAs the principal investigator behind the groundbreaking Stanford Sleep-Cognition Study, Maya identified specific brain wave patterns that predict creative problem-solving abilities—research that earned her the Blavatnik Young Scientist Award and has been featured in Nature Neuroscience.\n\nOver her 12-year career, Maya has developed proprietary cognitive assessment protocols now used by Fortune 100 executive teams and Olympic athletes alike. Her clients particularly value her data-driven approach that delivers measurable cognitive performance improvements while emphasizing sustainable mental well-being practices.\n\nMaya completed her neuroscience Ph.D. at Stanford University, where she now serves as an adjunct faculty member. When not working with clients or conducting research, you'll find her practicing what she preaches—whether that's through daily meditation, competitive chess matches, or hiking the Pacific Crest Trail with her rescue dog, Newton.\n\nMaya is currently accepting a limited number of new executive coaching clients and speaking engagements focused on peak cognitive performance.",
    category: "Professional",
    keywords: ["bio", "profile", "resume"],
  },
  {
    id: "9",
    title: "Interactive Story Creator",
    promptText:
      "Create the beginning of an interactive story in the genre of [genre]. The main character is [character description] in a setting of [setting]. Provide three choices for what the character should do next.",
    exampleOutput:
      "# THE FORGOTTEN OBSERVATORY\n\nThe ancient stone walls of the observatory creak and groan as another gust of wind batters the mountainside. You tighten your wool cloak, grateful for its protection against the biting cold that managed to infiltrate this supposedly abandoned place. The astronomical instruments—massive bronze arcs, spheres, and measuring devices—loom like sleeping giants in the dim light filtering through the dust-covered dome above.\n\nYour archaeological expedition wasn't supposed to come this far north, but the parchment fragments you discovered last month changed everything. If you're right, this observatory holds the key to a centuries-old celestial mapping system that predates modern astronomy by hundreds of years.\n\nThe metal detector in your pack suddenly emits a soft ping. At the same moment, you notice three things: a faint blue glow emanating from behind a fallen column, a leather-bound journal wedged beneath an ancient desk, and a narrow staircase spiraling down into darkness.\n\n**What do you do?**\n\n1. Investigate the mysterious blue glow coming from behind the column.\n2. Retrieve and examine the leather-bound journal first.\n3. Follow the spiral staircase downward to see where it leads.",
    category: "Entertainment",
    keywords: ["story", "interactive", "fiction"],
  },
  {
    id: "10",
    title: "Data Visualization Recommender",
    promptText:
      "I have a dataset with the following variables: [list variables]. I want to show the relationship between [variable X] and [variable Y], while possibly accounting for [variable Z]. What visualization approach would work best? Please recommend a specific chart type, explain why it's appropriate, and provide sample code in [programming language/tool].",
    exampleOutput:
      '## Visualization Recommendation: Animated Bubble Chart\n\nBased on your dataset variables (sales revenue, marketing spend, customer satisfaction, product category, and region across 5 years), I recommend an animated bubble chart to effectively show the relationship between marketing spend (x-axis) and sales revenue (y-axis), while accounting for customer satisfaction (bubble size) and product category (bubble color).\n\n### Why this works well:\n\n1. It displays the correlation between marketing spend and revenue directly through position\n2. The bubble size (customer satisfaction) adds a third quantitative dimension\n3. Color coding by product category allows pattern comparison across groups\n4. Animation over time (years) reveals temporal trends and ROI evolution\n5. Regions can be shown through faceting or as an interactive filter\n\n### Sample Python code using Plotly:\n\n```python\nimport plotly.express as px\nimport pandas as pd\n\n# Assuming your data is in a DataFrame called \'df\' with these columns:\n# \'year\', \'marketing_spend\', \'revenue\', \'satisfaction\', \'category\', \'region\'\n\nfig = px.scatter(df, \n                x="marketing_spend", \n                y="revenue",\n                size="satisfaction",\n                color="category",\n                animation_frame="year",\n                facet_col="region",\n                size_max=40,\n                hover_name="category",\n                text="category",\n                log_x=True,   # If marketing spend varies by orders of magnitude\n                trendline="ols",  # Adds regression lines for each category\n                labels={\n                    "marketing_spend": "Marketing Investment (USD)",\n                    "revenue": "Quarterly Revenue (USD)",\n                    "satisfaction": "Customer Satisfaction Score",\n                    "category": "Product Category"\n                },\n                title="Marketing ROI by Product Category and Region Over Time")\n                \n# Improve layout and formatting\nfig.update_layout(\n    plot_bgcolor="white",\n    font=dict(family="Arial", size=14),\n    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="center", x=0.5),\n    annotations=[dict(text="Bubble size represents customer satisfaction", \n                     showarrow=False, x=0.1, y=1.05, xref="paper", yref="paper")]\n)\n\nfig.update_xaxes(showgrid=True, gridwidth=1, gridcolor="lightgray")\nfig.update_yaxes(showgrid=True, gridwidth=1, gridcolor="lightgray")\n\nfig.show()\n```\n\n### Alternative Recommendations:\n\n1. **For static presentation:** Use a faceted scatter plot matrix showing each year in a separate panel\n2. **For more variables:** Consider a parallel coordinates plot if you need to show more dimensions\n3. **For executive summary:** A small multiples approach with trend lines by category might be more digestible',
    category: "Data",
    keywords: ["visualization", "charts", "analytics"],
  },
  {
    id: "11",
    title: "Video Script Outline",
    promptText:
      "Create a detailed outline for a [length] YouTube video about [topic]. The target audience is [audience description] who want to [audience goal]. Include an attention-grabbing hook, key sections with timestamps, talking points, and a strong call to action.",
    exampleOutput:
      '# HOW TO BUILD A MORNING ROUTINE THAT ACTUALLY WORKS\n*10-12 Minute Video for Young Professionals*\n\n## 00:00 - 00:45 | HOOK\n"The 5AM Club promises miracle mornings, but I tried it for 30 days and failed miserably. So did 81% of people in our survey. Here\'s what actually works instead..."\n* Show quick montage of common morning routine advice failing (spilled coffee, missed alarm, yoga interrupted)\n* Contrast with realistic, achievable morning wins\n* Promise: "By the end of this video, you\'ll have a personalized morning system that fits YOUR life—not someone else\'s Instagram feed"\n\n## 00:45 - 02:00 | THE MORNING MYTH\n* The false promises of one-size-fits-all routines\n* Introduce chronotype science (early birds vs. night owls is biological)\n* Why willpower-based approaches fail for 80% of people\n* The real goal: energy management, not time management\n\n## 02:00 - 04:30 | THE MINIMUM VIABLE MORNING\n* Introduce the 3-1-3 framework: 3 minutes, 1 focus, 3 components\n* Component 1: Physical reset (demo simple options)\n* Component 2: Mental clarity moment\n* Component 3: Day intention\n* Show examples for night owls vs. early birds\n\n## 04:30 - 06:30 | HABIT STACKING & TRIGGERS\n* Why standalone habits fail (science of neurological pathways)\n* How to identify your existing morning patterns\n* Building habit stacks using the "after I... I will..." formula\n* Environmental triggers that remove decision fatigue\n* Phone settings that prevent morning distractions\n\n## 06:30 - 08:30 | PERSONALIZATION FRAMEWORK\n* Quick self-assessment: chronotype, priorities, obstacles\n* Decision tree for customizing your approach\n* Examples of three different personas and their routines\n* The weekend protocol (how to maintain consistency)\n\n## 08:30 - 10:00 | TROUBLESHOOTING & EVOLUTION\n* The most common failure points (based on our survey)\n* How to restart after breaking the chain\n* Seasonal adjustments (darker mornings, etc.)\n* When and how to evolve your routine\n\n## 10:00 - END | CALL TO ACTION\n* 7-day starter challenge (simple version anyone can do)\n* Free download: Morning Blueprint Worksheet\n* Community challenge: "Share your realistic morning win using #ActualMornings"\n* Subscribe prompt with specific value promise\n\n## VISUAL ELEMENTS\n* Use split-screen comparisons of "Instagram ideal" vs. "actual reality"\n* Include simple animations for the science concepts\n* Text overlays for key frameworks and quotes\n* B-roll of realistic morning moments (not just perfect Bali retreats)\n\n## TALKING POINTS FOR AUTHENTICITY\n* Brief personal story about your own morning routine failures\n* Mention that you\'re NOT a morning person naturally\n* Research stats from sleep science studies\n* Acknowledge different life circumstances (parents, varied work schedules)',
    category: "Content Creation",
    keywords: ["video", "youtube", "script"],
  },
  {
    id: "12",
    title: "Learning Roadmap Creator",
    promptText:
      "Create a structured learning roadmap for someone who wants to learn [skill/field] from beginner to intermediate level. Break it down into phases with specific resources (books, courses, projects) for each phase. Assume they can dedicate [time commitment] per week.",
    exampleOutput:
      '# Frontend Development Roadmap: Beginner to Intermediate\n*Assuming 10 hours per week commitment*\n\n## Phase 1: Foundations (Weeks 1-4)\n\n### Week 1-2: HTML & CSS Basics\n**Learning Resources:**\n* **Course:** "HTML & CSS for Beginners" on MDN Web Docs (free)\n* **Book:** "HTML and CSS: Design and Build Websites" by Jon Duckett\n* **Practice:** Build a simple personal profile page with proper semantic HTML and responsive design\n\n### Week 3-4: JavaScript Fundamentals\n**Learning Resources:**\n* **Course:** "JavaScript Basics" on freeCodeCamp (free)\n* **Book:** "Eloquent JavaScript" by Marijn Haverbeke (free online)\n* **Practice:** Add interactive elements to your profile page (dark mode toggle, interactive navigation)\n\n**Phase 1 Project:** Personal portfolio site with responsive design and basic interactivity\n\n## Phase 2: Modern Frontend Development (Weeks 5-10)\n\n### Week 5-6: CSS Frameworks & Preprocessors\n**Learning Resources:**\n* **Course:** "Bootstrap 5 Crash Course" on YouTube by Traversy Media\n* **Documentation:** Tailwind CSS documentation\n* **Practice:** Rebuild your portfolio using a CSS framework\n\n### Week 7-8: JavaScript Deep Dive\n**Learning Resources:**\n* **Course:** "JavaScript: Understanding the Weird Parts" on Udemy\n* **Book:** "You Don\'t Know JS" series by Kyle Simpson (free on GitHub)\n* **Practice:** Build a weather app using a public API\n\n### Week 9-10: Introduction to React\n**Learning Resources:**\n* **Course:** "React Fundamentals" on Scrimba (free)\n* **Documentation:** Official React documentation\n* **Practice:** Convert your weather app to React components\n\n**Phase 2 Project:** Interactive dashboard with data visualization (using React and a CSS framework)\n\n## Phase 3: Building Real Applications (Weeks 11-16)\n\n### Week 11-12: State Management & Hooks\n**Learning Resources:**\n* **Course:** "React Hooks" on Egghead.io\n* **Documentation:** Redux documentation\n* **Practice:** Add global state management to your dashboard project\n\n### Week 13-14: Performance & Testing\n**Learning Resources:**\n* **Course:** "Web Performance Fundamentals" on Frontend Masters\n* **Book:** "Testing JavaScript Applications" by Lucas da Costa\n* **Practice:** Write tests for your React components\n\n### Week 15-16: Modern Tooling\n**Learning Resources:**\n* **Course:** "Webpack 5 Crash Course" on YouTube\n* **Documentation:** Vite.js documentation\n* **Practice:** Set up a modern build pipeline for your project\n\n**Phase 3 Project:** Full-featured web application (e-commerce storefront or content platform)\n\n## Phase 4: Professional Skills (Weeks 17-20)\n\n### Week 17-18: TypeScript Fundamentals\n**Learning Resources:**\n* **Course:** "TypeScript for JavaScript Developers" on Udemy\n* **Documentation:** Official TypeScript handbook\n* **Practice:** Convert part of your project to TypeScript\n\n### Week 19-20: Beyond Basics\n**Learning Resources:**\n* **Course:** "Next.js Crash Course" on YouTube\n* **Book:** "Refactoring UI" by Adam Wathan and Steve Schoger\n* **Practice:** Implement advanced UI patterns (infinite scroll, etc.)\n\n**Capstone Project:** Build a full-stack application with Next.js, TypeScript, and a headless CMS\n\n## Continuous Learning Resources\n\n**Community Engagement:**\n* Join the r/webdev and r/reactjs subreddits\n* Participate in Frontend Mentor challenges\n* Attend virtual meetups on Meetup.com\n\n**Coding Practice:**\n* Complete weekly challenges on CodePen\n* Contribute to open-source projects on GitHub\n* Build micro-projects to practice specific concepts\n\n**Advanced Topics to Explore Next:**\n* Server-side rendering and Static Site Generation\n* GraphQL API development\n* Animation libraries (Framer Motion, GSAP)\n* Mobile development with React Native',
    category: "Education",
    keywords: ["learning", "education", "roadmap"],
  },
];
