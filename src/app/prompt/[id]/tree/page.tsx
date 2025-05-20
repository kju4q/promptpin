"use client";

import React from "react";
import Header from "../../../components/Header";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import PromptSubmenu from "../../../components/PromptSubmenu";

export default function PromptTreePage() {
  const params = useParams();
  const pathname = usePathname();
  const promptId = params.id as string;

  return (
    <div className="flex flex-col h-screen relative">
      {/* Blurry cover for entire page */}
      <div className="fixed inset-0 z-0 bg-white/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <PromptSubmenu promptId={promptId} activeTab="tree" />
        <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          {/* Modal */}
          <div className="px-8 py-6 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              Prompt Tree Coming Soon
            </h2>
            <p className="text-gray-500 text-center">
              We're building a beautiful visualization of how prompts connect
              and evolve. Stay tuned!
            </p>
          </div>
          {/* Card shadows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl px-4 mt-12">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-xl shadow-lg border border-gray-100 opacity-60"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
