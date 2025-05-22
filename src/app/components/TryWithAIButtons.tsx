"use client";

import React from "react";

interface TryWithAIButtonsProps {
  onTryWithGPT: () => void;
  onTryWithClaude: () => void;
}

export default function TryWithAIButtons({
  onTryWithGPT,
  onTryWithClaude,
}: TryWithAIButtonsProps) {
  return (
    <div className="flex gap-1.5 justify-end">
      <button
        onClick={onTryWithGPT}
        className="px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium hover:bg-green-100 transition-colors duration-200"
      >
        Try with GPT
      </button>
      <button
        onClick={onTryWithClaude}
        className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium hover:bg-purple-100 transition-colors duration-200"
      >
        Try with Claude
      </button>
    </div>
  );
}
