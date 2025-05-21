"use client";

import React from "react";
import Header from "../../../components/Header";
import { useParams } from "next/navigation";
import PromptSubmenu from "../../../components/PromptSubmenu";
import ComingSoonCard from "../../../components/ComingSoonCard";

export default function PromptTreePage() {
  const params = useParams();
  const promptId = params.id as string;

  return (
    <div className="flex flex-col h-screen relative">
      <div className="fixed inset-0 z-0 bg-white/60 backdrop-blur-sm" />
      <div className="relative z-10">
        <Header />
        <PromptSubmenu promptId={promptId} activeTab="tree" />
        <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          <ComingSoonCard
            title="Prompt Tree Coming Soon"
            description="We're building visualization of how prompts connect and evolve. Stay tuned!"
          />
        </main>
      </div>
    </div>
  );
}
