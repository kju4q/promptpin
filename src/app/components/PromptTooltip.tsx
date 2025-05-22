"use client";

import React from "react";
import PromptTreeTooltip from "./PromptTreeTooltip";

interface PromptTooltipProps {
  isVisible: boolean;
  position: "right" | "left";
  tooltipWidth: number;
  tooltipGap: number;
}

export default function PromptTooltip({
  isVisible,
  position,
  tooltipWidth,
  tooltipGap,
}: PromptTooltipProps) {
  if (!isVisible) return null;

  return (
    <div
      style={{ width: tooltipWidth }}
      className={`absolute z-[9999] ${
        position === "right"
          ? `left-[calc(100%+${tooltipGap}px)]`
          : `right-[calc(100%+${tooltipGap}px)]`
      } top-0`}
    >
      <div className="transform transition-all duration-200 ease-out">
        <div className="h-28 bg-white rounded-lg shadow-lg border border-gray-200">
          <PromptTreeTooltip />
        </div>
      </div>
    </div>
  );
}
