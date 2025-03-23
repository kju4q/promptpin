import { useState } from "react";
import { Prompt } from "../data/prompts";
import Link from "next/link";

// Map categories to emojis
const categoryEmojis: Record<string, string> = {
  General: "✨",
  Business: "💼",
  Development: "💻",
  Marketing: "📢",
  Design: "🎨",
  "Content Creation": "✏️",
  Data: "📊",
  Education: "📚",
  Entertainment: "🎭",
  Lifestyle: "🌿",
  Professional: "👔",
};

interface PromptCardProps {
  prompt: Prompt;
  onSave: (id: string, saved: boolean) => void;
}

export default function PromptCard({ prompt, onSave }: PromptCardProps) {
  const [hovering, setHovering] = useState(false);
  const [rotation] = useState(() => {
    return Math.random() * 0.6 - 0.3; // Subtle rotation between -0.3 and 0.3 degrees
  });

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(prompt.id, !prompt.isSaved);
  };

  const emoji = categoryEmojis[prompt.category] || "✨";

  // Create tags from the prompt category and keywords
  const tags = [prompt.category];
  if (prompt.keywords && prompt.keywords.length > 0) {
    // Only add up to 2 more tags from keywords
    tags.push(...prompt.keywords.slice(0, 2));
  }

  return (
    <div
      className="border border-zinc-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 bg-white group"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 1px 2px, rgba(0, 0, 0, 0.04) 0px 2px 8px",
        transform: `rotate(${rotation}deg)`,
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="p-5">
        {/* Category label */}
        <div className="flex justify-between items-start mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-50 text-gray-700 border border-zinc-200">
            {emoji} {prompt.category}
          </span>

          {/* Save button */}
          <button
            onClick={handleSave}
            className="text-gray-400 hover:text-rose-500 transition-colors"
            aria-label={prompt.isSaved ? "Unsave prompt" : "Save prompt"}
          >
            {prompt.isSaved ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-rose-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:text-rose-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Prompt title */}
        <h3 className="text-lg font-medium mb-2 text-gray-800 line-clamp-1">
          {prompt.title}
        </h3>

        {/* Truncated prompt text */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {prompt.promptText}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
            >
              #{tag.toLowerCase().replace(/\s+/g, "")}
            </span>
          ))}
        </div>

        {/* View prompt button */}
        <div className="mt-auto">
          <Link
            href={`/prompt/${prompt.id}`}
            className="w-full btn btn-outline text-sm flex items-center justify-center gap-1"
          >
            <span>View Prompt</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Hover overlay with example output */}
        <div
          className={`absolute inset-0 bg-white/95 p-5 flex flex-col transition-opacity duration-300 ${
            hovering ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">
              Example Output
            </span>
            <span className="text-xs text-gray-400">AI-generated</span>
          </div>
          <p className="text-sm text-gray-600 font-medium italic flex-grow overflow-y-auto">
            {prompt.exampleOutput || "No example output available"}
          </p>
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex gap-2">
              <a
                href={`https://chat.openai.com/chat?prompt=${encodeURIComponent(
                  prompt.promptText
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Try with ChatGPT
              </a>
              <a
                href={`https://claude.ai/chat?prompt=${encodeURIComponent(
                  prompt.promptText
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Try with Claude
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
