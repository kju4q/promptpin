"use client";

import React from "react";
import PromptCard from "./PromptCard";
import { Prompt } from "@/app/types/prompt";

interface PromptGridProps {
  prompts: Prompt[];
  onSave?: (prompt: Prompt) => void;
  onUnsave?: (prompt: Prompt) => void;
  savedPromptIds?: Set<string>;
}

export default function PromptGrid({
  prompts,
  onSave,
  onUnsave,
  savedPromptIds = new Set(),
}: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 mb-4">
          <svg
            className="text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No prompts found</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-6 space-y-6">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onSave={onSave}
          onUnsave={onUnsave}
          isSaved={savedPromptIds.has(prompt.id)}
        />
      ))}
    </div>
  );
}
