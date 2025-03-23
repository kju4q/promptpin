"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import PromptGrid from "./components/PromptGrid";
import AddPromptForm from "./components/AddPromptForm";
import GeneratePrompt from "./components/GeneratePrompt";
import { Prompt, examplePrompts } from "./data/prompts";
import { generatePromptsForCategory } from "./utils/openai";
import {
  savePrompt,
  unsavePrompt,
  isPromptSaved,
  getUserPrompts,
  addUserPrompt,
  storeAllPrompts,
} from "./utils/promptStorage";
import Link from "next/link";

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [saveToastMessage, setSaveToastMessage] = useState("");
  const [isSavedAction, setIsSavedAction] = useState(false);

  const categories = [
    "Business",
    "Development",
    "Marketing",
    "Design",
    "Entertainment",
  ];

  // Function to load initial prompts from OpenAI
  const loadInitialPrompts = async () => {
    setIsLoading(true);
    setLoadError("");

    // Set a minimum loading time of 2 seconds
    const startTime = Date.now();

    try {
      // Get user prompts from local storage
      const userPrompts = getUserPrompts();

      // Store example prompts in localStorage for access by ID
      // This ensures we always have a set of prompts available
      storeAllPrompts(examplePrompts);

      // If we already have some user prompts, just use those
      if (userPrompts.length > 0) {
        const markedPrompts = userPrompts.map((prompt) => ({
          ...prompt,
          isSaved: isPromptSaved(prompt.id),
        }));

        setPrompts(markedPrompts);
        // Ensure we show loading for at least 2 seconds
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 2000) {
          setTimeout(() => {
            setIsLoading(false);
          }, 2000 - elapsedTime);
        } else {
          setIsLoading(false);
        }
        return;
      }

      // Otherwise fetch from OpenAI - select 2 random categories
      const randomCategories = [...categories]
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      // Get 2 prompts from each category
      const promises = randomCategories.map((category) =>
        generatePromptsForCategory(category, 2)
      );

      const results = await Promise.all(promises);
      const openAIPrompts = results.flat();

      // Store all API-generated prompts in localStorage for later retrieval
      storeAllPrompts(openAIPrompts);

      // Mark any saved prompts
      const markedPrompts = openAIPrompts.map((prompt) => ({
        ...prompt,
        isSaved: isPromptSaved(prompt.id),
      }));

      setPrompts(markedPrompts);
    } catch (error) {
      console.error("Error loading initial prompts:", error);
      setLoadError(
        "Failed to load prompts. Please refresh or try again later."
      );

      // Fallback to user prompts only
      const userPrompts = getUserPrompts();
      if (userPrompts.length > 0) {
        setPrompts(
          userPrompts.map((p) => ({ ...p, isSaved: isPromptSaved(p.id) }))
        );
      } else {
        // If no user prompts, fallback to example prompts
        setPrompts(
          examplePrompts.map((p) => ({ ...p, isSaved: isPromptSaved(p.id) }))
        );
      }
    } finally {
      // Ensure we show loading for at least 2 seconds
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 2000) {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000 - elapsedTime);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadInitialPrompts();
  }, []);

  const handleSavePrompt = (id: string) => {
    // Toggle saved state
    const prompt = prompts.find((p) => p.id === id);
    if (!prompt) return;

    if (prompt.isSaved) {
      unsavePrompt(id);
      setSaveToastMessage("Prompt unpinned");
      setIsSavedAction(false);
    } else {
      savePrompt(id);
      setSaveToastMessage("Prompt pinned to your collection! 📌");
      setIsSavedAction(true);
    }

    // Show toast notification
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);

    // Update state
    setPrompts((prevPrompts) =>
      prevPrompts.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const handleAddPrompt = (newPrompt: Omit<Prompt, "id">) => {
    // Add the prompt
    const prompt = addUserPrompt(newPrompt);

    // Add it to the list
    setPrompts((prevPrompts) => [prompt, ...prevPrompts]);
    setIsAddingPrompt(false);
  };

  return (
    <div className="flex flex-col h-full">
      <Header onAddClick={() => setIsAddingPrompt(true)} />
      <div className="container mx-auto px-4 py-4 flex-grow">
        <div className="mb-6">
          <div className="flex justify-center">
            <div className="px-4 py-2">
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm text-black">For you</span>
                <div className="h-0.5 bg-rose-300 rounded-full mt-1 w-12"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          <button
            disabled
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 opacity-50 cursor-not-allowed flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Prompt
          </button>

          <button
            disabled
            className="px-4 py-2 bg-gradient-to-r from-sky-300 to-sky-400 rounded-full text-sm text-white opacity-50 cursor-not-allowed flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            Generate with AI
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-sky-300 animate-spin mb-3"></div>
            <p className="text-gray-500 text-sm">Finding your prompts...</p>
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="text-sky-300 mb-3">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-2 text-center">{loadError}</p>
            <button
              onClick={loadInitialPrompts}
              className="px-4 py-1.5 bg-sky-300 text-white rounded-full text-sm hover:bg-sky-400"
            >
              Try Again
            </button>
          </div>
        ) : prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="text-gray-400 mb-3">
              <svg
                className="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No prompts found
            </h3>
            <p className="text-gray-500 mb-4 text-sm text-center max-w-md">
              Create your first prompt or generate some with AI.
            </p>
            <div className="flex gap-3">
              <button
                disabled
                className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm opacity-50 cursor-not-allowed"
              >
                Add Prompt
              </button>
              <button
                disabled
                className="px-4 py-1.5 bg-sky-300 text-white rounded-full text-sm opacity-50 cursor-not-allowed"
              >
                Generate with AI
              </button>
            </div>
          </div>
        ) : (
          <PromptGrid prompts={prompts} onSave={handleSavePrompt} />
        )}

        {isAddingPrompt && (
          <AddPromptForm
            onAdd={handleAddPrompt}
            onCancel={() => setIsAddingPrompt(false)}
          />
        )}

        {isGeneratingPrompt && (
          <GeneratePrompt
            onAddPrompt={(prompt) => {
              const newPrompt = addUserPrompt(prompt);
              setPrompts((prevPrompts) => [
                { ...newPrompt, isSaved: false },
                ...prevPrompts,
              ]);
            }}
            onClose={() => setIsGeneratingPrompt(false)}
          />
        )}

        {/* Toast notification for saving prompts */}
        {showSaveToast && (
          <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            {isSavedAction ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-sky-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
            {saveToastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
