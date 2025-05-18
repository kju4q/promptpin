"use client";

import React from "react";
import Header from "../../components/Header";
import PromptTreeTooltip from "../../components/PromptTreeTooltip";

export default function PromptTreePage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Prompt Tree
          </h2>
          <PromptTreeTooltip />
        </div>
      </main>
    </div>
  );
}
