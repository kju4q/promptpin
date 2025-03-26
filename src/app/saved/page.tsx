"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import PromptGrid from "../components/PromptGrid";
import AddPromptForm from "../components/AddPromptForm";
import { Prompt } from "../types/prompt";
import {
  getSavedPromptsData,
  savePrompt,
  unsavePrompt,
  addUserPrompt,
} from "../utils/promptStorage";

export default function SavedPage() {
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // Get saved prompts from localStorage using our utility function
    const fetchSavedPrompts = () => {
      const savedPromptsData = getSavedPromptsData();
      setSavedPrompts(savedPromptsData);
    };

    fetchSavedPrompts();
  }, []);

  const handleSavePrompt = (prompt: Prompt) => {
    // Since we're on the saved page, this will always be an unsave action
    unsavePrompt(prompt.id);

    // Show toast notification
    setToastMessage("Prompt removed from your collection");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    // Update state by removing the unsaved prompt
    setSavedPrompts((prev) => prev.filter((p) => p.id !== prompt.id));
  };

  const handleAddPrompt = (promptData: Omit<Prompt, "id">) => {
    // Add new prompt using our utility function
    const newPrompt = addUserPrompt(promptData);

    // Also save it
    savePrompt(newPrompt.id);

    // Add to saved prompts state
    setSavedPrompts((prev) => [...prev, newPrompt]);

    // Close the form
    setIsAddingPrompt(false);
  };

  return (
    <div className="min-h-screen">
      <Header onAddClick={() => setIsAddingPrompt(true)} />

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <h1 className="text-4xl font-bold mb-4 title-gradient">
            Your Saved Prompts
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your collection of favorite and created prompts
          </p>
          <button
            onClick={() => setIsAddingPrompt(true)}
            className="btn btn-primary hidden md:inline-flex"
          >
            <span className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Your Prompt
            </span>
          </button>
        </div>

        {savedPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              viewBox="0 0 24 24"
              className="w-16 h-16 text-gray-300 mb-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No saved prompts yet
            </h3>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Start saving prompts you like or create your own to build your
              collection
            </p>
            <button
              onClick={() => setIsAddingPrompt(true)}
              className="btn btn-primary"
            >
              <span className="flex items-center gap-1.5">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Your First Prompt
              </span>
            </button>
          </div>
        ) : (
          <PromptGrid prompts={savedPrompts} onSave={handleSavePrompt} />
        )}

        {isAddingPrompt && (
          <AddPromptForm
            onAdd={handleAddPrompt}
            onCancel={() => setIsAddingPrompt(false)}
          />
        )}
      </main>

      {/* Toast notification for unsaving prompts */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
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
          {toastMessage}
        </div>
      )}
    </div>
  );
}
