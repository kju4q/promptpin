"use client";

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import PromptGrid from "./components/PromptGrid";
import { examplePrompts } from "@/app/data/example-prompts";
import { Prompt } from "./types/prompt";
import {
  getSavedPrompts,
  savePrompt,
  unsavePrompt,
  storeAllPrompts,
} from "./utils/promptStorage";
import { useToast } from "./components/ui/toast-provider";

export default function Home() {
  const { toast } = useToast();
  const [savedPromptIds, setSavedPromptIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Store example prompts in localStorage
    storeAllPrompts(examplePrompts);

    // Load saved prompts on component mount
    const savedPrompts = getSavedPrompts();
    setSavedPromptIds(new Set(savedPrompts));
  }, []);

  const handleSavePrompt = async (prompt: Prompt) => {
    try {
      if (savedPromptIds.has(prompt.id)) {
        // Unsave the prompt
        unsavePrompt(prompt.id);
        setSavedPromptIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(prompt.id);
          return newSet;
        });
        toast({
          title: "Prompt unsaved",
          description: "The prompt has been removed from your saved prompts",
        });
      } else {
        // Save the prompt
        savePrompt(prompt.id);
        setSavedPromptIds((prev) => new Set([...prev, prompt.id]));
        toast({
          title: "Prompt saved",
          description: "The prompt has been added to your saved prompts",
        });
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast({
        title: "Error",
        description: "Failed to save the prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            <PromptGrid
              prompts={examplePrompts}
              onSave={handleSavePrompt}
              savedPromptIds={savedPromptIds}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
