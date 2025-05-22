"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Prompt } from "@/app/types/prompt";
import { usePromptStatsStore } from "@/app/store/promptStatsStore";
import TryWithAIButtons from "./TryWithAIButtons";
import SavePromptButton from "./SavePromptButton";
import PromptTooltip from "./PromptTooltip";

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
  const { incrementViews, incrementUses } = usePromptStatsStore();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<"right" | "left">(
    "right"
  );

  const handleTryWithAI = (model: "gpt" | "claude") => {
    incrementUses(prompt.id);
    const encodedPrompt = encodeURIComponent(prompt.promptText);

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

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const spaceOnRight = window.innerWidth - rect.right;
      setTooltipPosition(spaceOnRight >= TOOLTIP_WIDTH ? "right" : "left");
    }
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-visible break-inside-avoid mb-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SavePromptButton
        isSaved={isSaved}
        onSave={async () => onSave?.(prompt)}
        onUnsave={async () => onUnsave?.(prompt)}
        showButton={showSaveButton}
      />

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

        <TryWithAIButtons
          onTryWithGPT={() => handleTryWithAI("gpt")}
          onTryWithClaude={() => handleTryWithAI("claude")}
        />
      </div>

      <PromptTooltip
        isVisible={isHovered}
        position={tooltipPosition}
        tooltipWidth={TOOLTIP_WIDTH}
        tooltipGap={TOOLTIP_GAP}
      />
    </div>
  );
}
