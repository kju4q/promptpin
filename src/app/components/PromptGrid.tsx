import PromptCard from "./PromptCard";
import { Prompt } from "../data/prompts";

interface PromptGridProps {
  prompts: Prompt[];
  onSave: (id: string) => void;
}

export default function PromptGrid({ prompts, onSave }: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 mb-4">
          <svg
            className="text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-600 mb-2">
          No prompts found
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          No prompts found in this collection. Start by adding your first
          prompt!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 auto-rows-fr">
      {prompts.map((prompt) => (
        <div key={prompt.id} className="h-full">
          <PromptCard prompt={prompt} onSave={onSave} />
        </div>
      ))}
    </div>
  );
}
