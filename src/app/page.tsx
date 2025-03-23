"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import PromptGrid from "./components/PromptGrid";
import AddPromptForm from "./components/AddPromptForm";
import { examplePrompts, Prompt } from "./data/prompts";
import {
  savePrompt,
  unsavePrompt,
  isPromptSaved,
  getUserPrompts,
  addUserPrompt,
} from "./utils/promptStorage";
import Link from "next/link";

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);

  useEffect(() => {
    // Get all prompts from examples and user-created
    const userPrompts = getUserPrompts();
    const allPrompts = [...examplePrompts, ...userPrompts];

    // Mark saved prompts
    const markedPrompts = allPrompts.map((prompt) => ({
      ...prompt,
      isSaved: isPromptSaved(prompt.id),
    }));

    setPrompts(markedPrompts);
  }, []);

  const handleSavePrompt = (id: string) => {
    // Toggle saved state
    const prompt = prompts.find((p) => p.id === id);
    if (!prompt) return;

    if (prompt.isSaved) {
      unsavePrompt(id);
    } else {
      savePrompt(id);
    }

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
    <div className="min-h-screen bg-white">
      <Header onAddClick={() => setIsAddingPrompt(true)} />

      <main className="px-4 py-2">
        <div className="mb-4">
          <div className="flex justify-center">
            <div className="px-4 py-2">
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm text-black">For you</span>
                <div className="h-0.5 bg-rose-300 rounded-full mt-1 w-12"></div>
              </div>
            </div>
          </div>
        </div>

        <PromptGrid prompts={prompts} onSave={handleSavePrompt} />

        {isAddingPrompt && (
          <AddPromptForm
            onAdd={handleAddPrompt}
            onCancel={() => setIsAddingPrompt(false)}
          />
        )}
      </main>
    </div>
  );
}
