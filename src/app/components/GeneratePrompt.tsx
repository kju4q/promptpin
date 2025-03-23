import React, { useState } from "react";
import { generatePrompt, generatePromptsForCategory } from "../utils/openai";
import { Prompt } from "../data/prompts";
import { storeAllPrompts } from "../utils/promptStorage";

interface GeneratePromptProps {
  onAddPrompt: (prompt: Prompt) => void;
  onClose: () => void;
}

export default function GeneratePrompt({
  onAddPrompt,
  onClose,
}: GeneratePromptProps) {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(1);

  const categories = [
    "Business",
    "Development",
    "Marketing",
    "Design",
    "Content",
    "Data",
    "Education",
    "Entertainment",
    "Lifestyle",
    "Professional",
  ];

  const handleGeneratePrompt = async () => {
    if (!topic && !category) {
      setError("Please enter a topic or select a category");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      if (topic) {
        // Generate a single prompt based on topic
        const generatedPrompt = await generatePrompt(topic);

        // Store prompt in localStorage for future retrieval
        storeAllPrompts([generatedPrompt]);

        onAddPrompt(generatedPrompt);
      } else if (category) {
        // Generate multiple prompts for a category
        const generatedPrompts = await generatePromptsForCategory(
          category,
          count
        );

        // Store all generated prompts in localStorage
        storeAllPrompts(generatedPrompts);

        // Add the first prompt and save the rest
        if (generatedPrompts.length > 0) {
          onAddPrompt(generatedPrompts[0]);
          // You could save the rest or add them all at once
          if (generatedPrompts.length > 1) {
            for (let i = 1; i < generatedPrompts.length; i++) {
              setTimeout(() => {
                onAddPrompt(generatedPrompts[i]);
              }, i * 300);
            }
          }
        }
      }
      onClose();
    } catch (err) {
      console.error("Error generating prompt:", err);
      setError(
        "Error generating prompt. Please check your API key and try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg p-7 w-full max-w-md border border-zinc-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="mb-2 inline-flex items-center py-1 px-2.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium border border-zinc-200">
              <span className="mr-1">✨</span> Generate
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Generate AI Prompt
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded-full"
            disabled={isGenerating}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Topic
            </label>
            <input
              type="text"
              placeholder="e.g., Climate change, Virtual reality, Content marketing"
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Or select a category
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 appearance-none pr-10 transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isGenerating || topic !== ""}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {category && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Number of prompts to generate
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 appearance-none pr-10 transition-all"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  disabled={isGenerating}
                >
                  {[1, 2, 3, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-rose-500 text-sm bg-rose-50 p-3 rounded-lg border border-rose-200">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              onClick={handleGeneratePrompt}
              className="px-4 py-2 bg-gradient-to-r from-rose-400 to-amber-400 text-white rounded-full hover:from-rose-500 hover:to-amber-500 transition-colors flex items-center gap-1.5"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  Generate Prompt
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
