"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Prompt } from "../../types/prompt";
import { examplePrompts } from "../../data/example-prompts";
import {
  getUserPrompts,
  isPromptSaved,
  savePrompt,
  unsavePrompt,
  getAllPrompts,
  addToAllPrompts,
} from "../../utils/promptStorage";
import Header from "../../components/Header";
import Link from "next/link";
import { generatePrompt } from "../../utils/openai";
import { useToast } from "@/app/components/ui/toast-provider";

// Helper function to ensure prompt has all required fields
const ensurePromptFields = (prompt: Partial<Prompt>): Prompt => {
  const now = new Date().toISOString();
  return {
    ...prompt,
    createdAt: prompt.createdAt || now,
    updatedAt: prompt.updatedAt || now,
    severity: prompt.severity || "low",
  } as Prompt;
};

// Client Component that handles the prompt fetching and display
export default function PromptDetailClient({ promptId }: { promptId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingFromAPI, setIsFetchingFromAPI] = useState(false);
  const [showClaudeCopyToast, setShowClaudeCopyToast] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [saveToastMessage, setSaveToastMessage] = useState("");

  useEffect(() => {
    console.log(
      "PromptDetailClient useEffect running with promptId:",
      promptId
    );
    if (!promptId) {
      console.error("No promptId provided");
      return;
    }

    const fetchPrompt = async () => {
      console.log("fetchPrompt function starting");
      setIsLoading(true);
      setError(null);

      // Set a minimum loading time of 2 seconds
      const startTime = Date.now();

      try {
        console.log(`Fetching prompt with ID: ${promptId}`);

        // Get all user prompts from localStorage
        const userPrompts = getUserPrompts();
        console.log("User prompts found:", userPrompts.length);
        console.log(
          "User prompt IDs:",
          userPrompts.map((p) => p.id)
        );

        // Find the prompt with the matching ID
        let foundPrompt = userPrompts.find((p) => p.id === promptId);
        if (foundPrompt) {
          console.log("Found prompt in user prompts:", foundPrompt.title);
          foundPrompt = ensurePromptFields(foundPrompt);
        } else {
          console.log("Prompt not found in user prompts");
        }

        // If not found in user prompts, check if it's in all prompts
        if (!foundPrompt) {
          // For API-generated prompts, we need to check the all prompts storage
          const allPrompts = getAllPrompts();
          console.log("All prompts found:", allPrompts.length);
          console.log(
            "All prompt IDs:",
            allPrompts.map((p) => p.id)
          );
          foundPrompt = allPrompts.find((p) => p.id === promptId);
          if (foundPrompt) {
            console.log("Found prompt in all prompts:", foundPrompt.title);
            foundPrompt = ensurePromptFields(foundPrompt);
          } else {
            console.log("Prompt not found in all prompts");
          }
        }

        // If still not found, check example prompts
        if (!foundPrompt) {
          console.log(
            "Looking in example prompts, count:",
            examplePrompts.length
          );
          console.log(
            "Example prompt IDs:",
            examplePrompts.map((p) => p.id)
          );
          const examplePrompt = examplePrompts.find((p) => p.id === promptId);
          if (examplePrompt) {
            console.log(
              "Found prompt in example prompts:",
              examplePrompt.title
            );
            foundPrompt = ensurePromptFields(examplePrompt);
          } else {
            console.log("Prompt not found in example prompts");
          }
        }

        // Log where we are in the process
        console.log(
          "After checking all prompt sources, foundPrompt:",
          !!foundPrompt
        );

        // If prompt is still not found, try to fetch from OpenAI API
        if (!foundPrompt) {
          console.log(
            "Prompt not found in any storage, attempting to generate a new one"
          );
          setIsFetchingFromAPI(true);

          try {
            // Extract any possible topic from the ID or use "general"
            const topic = "general";

            // Generate a new prompt
            const openAIPrompt = await generatePrompt(topic);

            // Assign the ID from URL to maintain consistency and add required fields
            const now = new Date().toISOString();
            foundPrompt = ensurePromptFields({
              ...openAIPrompt,
              id: promptId,
            });

            console.log(
              "Successfully generated new prompt from API:",
              foundPrompt.title
            );
          } catch (apiError) {
            console.error("Failed to fetch from OpenAI API:", apiError);
            // Continue with the normal flow, will show error message
          } finally {
            setIsFetchingFromAPI(false);
          }
        }

        if (foundPrompt) {
          console.log("Setting prompt:", foundPrompt.title);
          setPrompt(foundPrompt);
          setIsSaved(isPromptSaved(promptId));
          console.log("Is prompt saved:", isPromptSaved(promptId));
        } else {
          console.error(`Prompt with ID ${promptId} not found`);
          setError(
            `We couldn't find the prompt you're looking for (ID: ${promptId}). It may have been deleted or it doesn't exist.`
          );
        }
      } catch (error) {
        console.error("Error fetching prompt:", error);
        setError(
          "An error occurred while trying to retrieve the prompt. Please try again later."
        );
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

    fetchPrompt();
  }, [promptId]);

  const handleSaveToggle = () => {
    if (!prompt) return;

    if (isSaved) {
      // Remove from saved
      unsavePrompt(prompt.id);
      setIsSaved(false);
      setSaveToastMessage("Prompt unpinned");
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
      toast({
        title: "Prompt unpinned",
        description: "The prompt has been removed from your collection",
      });
    } else {
      // Add to saved
      savePrompt(prompt.id);
      // Make sure this prompt is in allPrompts storage
      addToAllPrompts(prompt);
      setIsSaved(true);
      setSaveToastMessage("Prompt pinned to your collection! 📌");
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
      toast({
        title: "Prompt pinned",
        description: "The prompt has been added to your collection! 📌",
      });
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          {isFetchingFromAPI && (
            <p className="mt-4 text-center text-sm text-gray-500">
              Prompt not found locally. Finding prompts for you...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="mb-6 w-20 h-20 mx-auto text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Prompt Not Found</h1>
          <p className="mb-8 text-gray-600 max-w-lg mx-auto">
            {error || "We couldn't find the prompt you're looking for."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/"
              className="px-4 py-2 bg-sky-400 text-white rounded-full hover:bg-sky-500 transition-colors"
            >
              Return Home
            </Link>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get emoji for the category
  const categoryEmojis: Record<string, string> = {
    General: "✨",
    Business: "💼",
    Development: "💻",
    Marketing: "📢",
    Design: "🎨",
    "Content Creation": "✏️",
    Data: "📊",
    Education: "📚",
    Entertainment: "🎭",
    Lifestyle: "🌿",
    Professional: "👔",
  };

  const emoji = categoryEmojis[prompt.category] || "✨";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex space-x-4 max-w-4xl mx-auto px-4">
          <Link
            href={`/prompt/${promptId}`}
            className={`pb-2 ${
              pathname === `/prompt/${promptId}`
                ? "border-b-2 border-rose-500 text-rose-600 font-semibold"
                : "text-gray-600 hover:text-rose-500"
            }`}
          >
            Details
          </Link>
          <Link
            href={`/prompt/${promptId}/tree`}
            className={`pb-2 ${
              pathname === `/prompt/${promptId}/tree`
                ? "border-b-2 border-rose-500 text-rose-600 font-semibold"
                : "text-gray-600 hover:text-rose-500"
            }`}
          >
            Prompt Tree
          </Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-sky-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Prompts
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-neutral-50 text-gray-700 border border-zinc-200">
                {emoji} {prompt.category}
              </span>

              <button
                onClick={handleSaveToggle}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  isSaved
                    ? "bg-sky-50 text-sky-500 border border-sky-200"
                    : "bg-neutral-50 text-gray-600 hover:text-sky-500 border border-zinc-200"
                }`}
              >
                {isSaved ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Save
                  </>
                )}
              </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              {prompt.title}
            </h1>

            {/* Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {prompt.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {prompt.description && (
              <div className="mt-6 bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {prompt.description}
                </p>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Prompt Text</h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-600 whitespace-pre-wrap">
                  {prompt.promptText}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a
                href={`https://chat.openai.com/?model=gpt-4&q=${encodeURIComponent(
                  prompt.promptText
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-full hover:from-sky-500 hover:to-blue-600 transition-colors flex-1 flex justify-center items-center text-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5094-2.6067-1.4998z"></path>
                </svg>
                Try with ChatGPT
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCopyToClipboard(prompt.promptText);
                  window.open("https://claude.ai/chats", "_blank");
                }}
                className="px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-full hover:from-sky-500 hover:to-blue-600 transition-colors flex-1 flex justify-center items-center text-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.2838 1.13559C11.654 0.952131 12.089 0.952131 12.4591 1.13559L21.5475 5.69767C21.9177 5.88113 22.1351 6.26794 22.1351 6.6875C22.1351 7.10706 21.9177 7.49387 21.5475 7.67734L12.4591 12.2394C12.089 12.4229 11.654 12.4229 11.2838 12.2394L2.19543 7.67734C1.82523 7.49387 1.60779 7.10706 1.60779 6.6875C1.60779 6.26794 1.82523 5.88113 2.19543 5.69767L11.2838 1.13559Z" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.19543 10.4023C2.56564 10.2188 3.00072 10.2188 3.37092 10.4023L11.8715 14.6309L20.372 10.4023C20.7422 10.2188 21.1773 10.2188 21.5475 10.4023C21.9177 10.5857 22.1351 10.9725 22.1351 11.3921V16.9375C22.1351 17.357 21.9177 17.7439 21.5475 17.9273L12.4591 22.4894C12.089 22.6729 11.654 22.6729 11.2838 22.4894L2.19543 17.9273C1.82523 17.7439 1.60779 17.357 1.60779 16.9375V11.3921C1.60779 10.9725 1.82523 10.5857 2.19543 10.4023Z"
                  />
                </svg>
                Try with Claude
              </a>
              <button
                onClick={() => handleCopyToClipboard(prompt.promptText)}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors flex justify-center items-center text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                Copy Prompt
              </button>
            </div>
          </div>
        </div>

        {/* Toast notifications container positioned at the top center */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-50">
          {/* Toast message for Claude copy */}
          {showClaudeCopyToast && (
            <div className="bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-lg">
              Prompt copied to clipboard for Claude
            </div>
          )}

          {/* Toast message for Save/Pin action */}
          {showSaveToast && (
            <div className="bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
              {isSaved ? (
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
    </div>
  );
}
