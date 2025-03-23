"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Prompt } from "../../data/prompts";
import { examplePrompts } from "../../data/prompts";
import Header from "../../components/Header";
import Link from "next/link";

export default function PromptDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Find the prompt with the matching ID
    const foundPrompt = examplePrompts.find((p) => p.id === params.id);

    if (foundPrompt) {
      setPrompt(foundPrompt);

      // Check if the prompt is saved in localStorage
      const savedPrompts = JSON.parse(
        localStorage.getItem("savedPrompts") || "[]"
      );
      setIsSaved(savedPrompts.includes(foundPrompt.id));
    }

    setIsLoading(false);
  }, [params.id]);

  const handleSaveToggle = () => {
    if (!prompt) return;

    const savedPrompts = JSON.parse(
      localStorage.getItem("savedPrompts") || "[]"
    );

    if (isSaved) {
      // Remove from saved
      const updatedSavedPrompts = savedPrompts.filter(
        (id: string) => id !== prompt.id
      );
      localStorage.setItem("savedPrompts", JSON.stringify(updatedSavedPrompts));
      setIsSaved(false);
    } else {
      // Add to saved
      savedPrompts.push(prompt.id);
      localStorage.setItem("savedPrompts", JSON.stringify(savedPrompts));
      setIsSaved(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Prompt Not Found</h1>
          <p className="mb-8 text-gray-600">
            We couldn't find the prompt you're looking for.
          </p>
          <Link href="/" className="btn btn-primary">
            Return Home
          </Link>
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
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-rose-500 transition-colors"
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
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-neutral-50 text-gray-700 border border-zinc-200">
                {emoji} {prompt.category}
              </span>

              <button
                onClick={handleSaveToggle}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  isSaved
                    ? "bg-rose-50 text-rose-500 border border-rose-200"
                    : "bg-neutral-50 text-gray-600 hover:text-rose-500 border border-zinc-200"
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

            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              {prompt.title}
            </h1>

            {/* Tags */}
            {prompt.keywords && prompt.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {prompt.keywords.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                  >
                    #{tag.toLowerCase().replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Prompt
              </h2>
              <div className="bg-neutral-50 p-6 rounded-xl border border-zinc-200 font-mono text-gray-700 whitespace-pre-wrap">
                {prompt.promptText}
              </div>
            </div>

            {prompt.exampleOutput && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                  Example Output
                </h2>
                <div className="bg-neutral-50 p-6 rounded-xl border border-zinc-200 whitespace-pre-wrap text-gray-700">
                  {prompt.exampleOutput}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a
                href={`https://chat.openai.com/chat?prompt=${encodeURIComponent(
                  prompt.promptText
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex-1 justify-center items-center text-sm"
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
                href={`https://claude.ai/chat?prompt=${encodeURIComponent(
                  prompt.promptText
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex-1 justify-center items-center text-sm"
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
                onClick={() => navigator.clipboard.writeText(prompt.promptText)}
                className="btn btn-outline justify-center items-center text-sm"
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
      </div>
    </div>
  );
}
