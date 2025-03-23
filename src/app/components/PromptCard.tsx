import { useState } from "react";
import { useRouter } from "next/navigation";
import { Prompt } from "../data/prompts";

interface PromptCardProps {
  prompt: Prompt;
  onSave: (id: string) => void;
}

export default function PromptCard({ prompt, onSave }: PromptCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get emoji for the category
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
    Content: "✏️",
  };

  const emoji = categoryEmojis[prompt.category] || "✨";

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't navigate
    setIsAnimating(true);
    onSave(prompt.id);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleCardClick = () => {
    router.push(`/prompt/${prompt.id}`);
  };

  return (
    <div
      className="animate-fadeIn h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="border border-zinc-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col min-h-[250px]"
        onClick={handleCardClick}
      >
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-50 text-gray-700 border border-zinc-200">
              {emoji} {prompt.category}
            </span>

            <button
              onClick={handleSave}
              className="text-sky-400 hover:text-sky-500 focus:outline-none"
            >
              <span className={isAnimating ? "favorite-animation block" : ""}>
                {prompt.isSaved ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                    className="h-5 w-5"
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
              </span>
            </button>
          </div>

          <h3 className="text-base font-semibold mb-3 text-gray-800 line-clamp-2">
            {prompt.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
            {prompt.promptText}
          </p>

          <div className="flex justify-start mt-auto">
            <button
              onClick={handleCardClick}
              className="text-xs text-gray-500 flex items-center hover:text-sky-500 transition-colors"
            >
              <span>View prompt</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
