"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Prompt } from "@/app/types/prompt";
import {
  getSavedPromptsData,
  isPromptSaved,
  savePrompt,
  unsavePrompt,
} from "@/app/utils/promptStorage";
import { useToast } from "@/app/components/ui/toast-provider";

export default function SavedPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedPrompts = () => {
      try {
        const saved = getSavedPromptsData();
        setSavedPrompts(saved);
      } catch (error) {
        console.error("Error loading saved prompts:", error);
        toast({
          title: "Error",
          description: "Failed to load saved prompts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedPrompts();
  }, [toast]);

  const handleSavePrompt = (promptId: string) => {
    try {
      if (isPromptSaved(promptId)) {
        unsavePrompt(promptId);
        setSavedPrompts((prev) => prev.filter((p) => p.id !== promptId));
        toast({
          title: "Prompt unpinned",
          description: "The prompt has been removed from your collection",
        });
      } else {
        savePrompt(promptId);
        const saved = getSavedPromptsData();
        setSavedPrompts(saved);
        toast({
          title: "Prompt pinned",
          description: "The prompt has been added to your collection! 📌",
        });
      }
    } catch (error) {
      console.error("Error toggling prompt save:", error);
      toast({
        title: "Error",
        description: "Failed to update prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Prompts</h1>
        {savedPrompts.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No saved prompts
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by saving some prompts you like.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Browse Prompts
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {savedPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {prompt.title}
                    </h2>
                    {prompt.description && (
                      <p className="mt-1 text-gray-600">{prompt.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleSavePrompt(prompt.id)}
                    className="p-2 rounded-full text-red-500 hover:text-red-600 transition-colors"
                  >
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
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm">
                    {prompt.promptText}
                  </pre>
                </div>
                <div className="flex flex-wrap gap-2">
                  {prompt.category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                      {prompt.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
