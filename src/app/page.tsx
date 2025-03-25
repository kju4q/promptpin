"use client";

import React from "react";
import Header from "./components/Header";
import PromptGrid from "./components/PromptGrid";
import { examplePrompts } from "@/app/data/example-prompts";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="py-3">
            <div className="flex justify-center">
              <div className="px-4 py-1">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm text-black">For you</span>
                  <div className="h-0.5 bg-rose-300 rounded-full mt-1 w-12"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 px-2 overflow-auto">
            <PromptGrid prompts={examplePrompts} />
          </div>
        </div>
      </main>
    </div>
  );
}
