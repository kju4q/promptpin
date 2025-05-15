"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Prompt } from "@/app/types/prompt";
import { usePromptStatsStore } from "@/app/store/promptStatsStore";
import PromptTreeTooltip from "./PromptTreeTooltip";

interface PromptCardProps {
  prompt: Prompt;
  onSave?: (prompt: Prompt) => void;
  onUnsave?: (prompt: Prompt) => void;
  isSaved?: boolean;
  showSaveButton?: boolean;
}

const TOOLTIP_WIDTH = 220; // px, must match the tooltip's actual width
const TOOLTIP_GAP = 8; // px, space between card and tooltip

export default function PromptCard({
  prompt,
  onSave,
  onUnsave,
  isSaved = false,
  showSaveButton = true,
}: PromptCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { incrementViews, incrementUses } = usePromptStatsStore();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<"right" | "left">(
    "right"
  );

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (isSaved && onUnsave) {
        await onUnsave(prompt);
      } else if (onSave) {
        await onSave(prompt);
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryWithAI = (model: "gpt" | "claude") => {
    incrementUses(prompt.id);
    // Encode the prompt text for URL safety
    const encodedPrompt = encodeURIComponent(prompt.promptText);

    // Open AI service in new tab with the prompt
    if (model === "gpt") {
      window
        .open(
          `https://chat.openai.com/?model=gpt-4&prompt=${encodedPrompt}`,
          "_blank"
        )
        ?.focus();
    } else if (model === "claude") {
      window
        .open(`https://claude.ai/chat?prompt=${encodedPrompt}`, "_blank")
        ?.focus();
    }
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
    incrementViews(prompt.id);

    // Check available space
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const spaceOnRight = window.innerWidth - rect.right;
      const spaceOnLeft = rect.left;
      setTooltipPosition(spaceOnRight >= TOOLTIP_WIDTH ? "right" : "left");
    }
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  console.log("Current hover state:", isHovered);

  return (
    <div
      ref={cardRef}
      className={`group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-visible break-inside-avoid mb-2`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showSaveButton && (
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
      )}

      <div className="p-3">
        <Link href={`/prompt/${prompt.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
            {prompt.title}
          </h3>
          {prompt.description && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
              {prompt.description}
            </p>
          )}
        </Link>

        <div className="flex gap-1.5 justify-end">
          <button
            onClick={() => handleTryWithAI("gpt")}
            className="px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium hover:bg-green-100 transition-colors duration-200"
          >
            Try with GPT
          </button>
          <button
            onClick={() => handleTryWithAI("claude")}
            className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium hover:bg-purple-100 transition-colors duration-200"
          >
            Try with Claude
          </button>
        </div>
      </div>

      {/* Tooltip */}
      {isHovered && (
        <div
          className={`absolute z-[9999] ${
            tooltipPosition === "right"
              ? `left-[calc(100%+${TOOLTIP_GAP}px)]`
              : `right-[calc(100%+${TOOLTIP_GAP}px)]`
          } top-0`}
        >
          <div className="transform transition-all duration-200 ease-out">
            <div
              style={{ width: TOOLTIP_WIDTH }}
              className="h-28 bg-white rounded-lg shadow-lg border border-gray-200"
            >
              <PromptTreeTooltip />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
