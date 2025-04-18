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

export default function TikTokPage() {
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<ExtractedPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  // Convert ExtractedPrompt to Prompt format for PromptGrid
  const formattedPrompts: Prompt[] = prompts.map((p, index) => ({
    id: `tiktok-${index}`,
    title: p.creativeTitle,
    description: `AI prompt from TikTok video by ${p.author}`,
    promptText: p.prompt,
    category: "TikTok",
    tags: ["tiktok", "ai", "prompt"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    severity: "low",
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            TikTok AI Prompts
          </h1>
          <p className="text-gray-600 mb-6">
            Discover AI prompts from trending TikTok videos.
          </p>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Refresh Prompts"}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <PromptGrid prompts={formattedPrompts} />
        )}
      </div>
    </div>
  );
}
