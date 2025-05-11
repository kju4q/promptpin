/**
 * TikTok AI Prompts Page
 *
 * This page fetches trending TikTok videos and extracts AI-related prompts from them.
 * The data is collected through the following process:
 * 1. Fetches trending TikTok videos using the TikTok API
 * 2. Filters videos that contain AI-related hashtags or descriptions
 * 3. Extracts prompts from either:
 *    - Video descriptions
 *    - Video comments
 *    - Generated from video content (if no direct prompt is found)
 * 4. Displays the prompts in a grid format with options to save them
 *
 * Each prompt includes:
 * - The prompt text
 * - The original video author
 * - Source type (description/comment/generated)
 * - Video thumbnail and link
 */

"use client";

import React, { useEffect, useState } from "react";
import {
  ExtractedPrompt,
  fetchTrendingPrompts,
} from "../utils/tiktok/tikApiService";
import { useToast } from "../components/ui/toast-provider";
import Header from "../components/Header";
import PromptGrid from "../components/PromptGrid";
import { Prompt } from "../types/prompt";
import {
  getSavedPrompts,
  savePrompt,
  unsavePrompt,
} from "../utils/promptStorage";

export default function TikTokPage() {
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<ExtractedPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedPromptIds, setSavedPromptIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load saved prompts on component mount
    const savedPrompts = getSavedPrompts();
    setSavedPromptIds(new Set(savedPrompts));
    fetchTrendingData();
  }, []);

  const fetchTrendingData = async () => {
    setIsLoading(true);
    try {
      const fetchedPrompts = await fetchTrendingPrompts();
      setPrompts(fetchedPrompts);

      if (fetchedPrompts.length === 0) {
        toast({
          title: "No prompts found",
          description: "No AI prompts were found in trending TikTok videos.",
        });
      }
    } catch (error) {
      console.error("Error fetching trending prompts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch TikTok prompts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTrendingData();
  };

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

  // Convert ExtractedPrompt to Prompt format for PromptGrid
  const formattedPrompts: Prompt[] = prompts.map((p, index) => ({
    id: `tiktok-${index}`,
    title: p.creativeTitle || p.prompt.slice(0, 50) + "...",
    description: `AI prompt from TikTok video by ${p.author}`,
    promptText: p.prompt,
    category: "TikTok",
    tags: ["tiktok", "ai", "prompt"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "low",
  }));

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="py-3">
            <div className="flex justify-center">
              <div className="px-4 py-1">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm text-black">TikTok AI Prompts</span>
                  <div className="h-0.5 bg-rose-300 rounded-full mt-1 w-12"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 px-2 overflow-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <PromptGrid
                prompts={formattedPrompts}
                onSave={handleSavePrompt}
                savedPromptIds={savedPromptIds}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
