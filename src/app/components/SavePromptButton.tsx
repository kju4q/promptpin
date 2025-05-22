"use client";

import React, { useState } from "react";

interface SavePromptButtonProps {
  isSaved: boolean;
  onSave: () => Promise<void>;
  onUnsave: () => Promise<void>;
  showButton?: boolean;
}

export default function SavePromptButton({
  isSaved,
  onSave,
  onUnsave,
  showButton = true,
}: SavePromptButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (isSaved) {
        await onUnsave();
      } else {
        await onSave();
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showButton) return null;

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className={`absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 shadow-sm invisible group-hover:visible transition-colors duration-200 ${
        isSaved ? "text-red-500" : "text-gray-700 hover:text-red-500"
      }`}
    >
      {isLoading ? (
        <svg
          className="w-6 h-6 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : isSaved ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}
