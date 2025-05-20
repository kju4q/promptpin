"use client";

import Link from "next/link";

export default function PromptSubmenu({
  promptId,
  activeTab,
}: {
  promptId: string;
  activeTab: "details" | "tree";
}) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex space-x-4 max-w-4xl mx-auto px-4">
        <Link
          href={`/prompt/${promptId}`}
          className={`pb-2 ${
            activeTab === "details"
              ? "border-b-2 border-rose-500 text-rose-600 font-semibold"
              : "text-gray-600 hover:text-rose-500"
          }`}
        >
          Details
        </Link>
        <Link
          href={`/prompt/${promptId}/tree`}
          className={`pb-2 ${
            activeTab === "tree"
              ? "border-b-2 border-rose-500 text-rose-600 font-semibold"
              : "text-gray-600 hover:text-rose-500"
          }`}
        >
          Prompt Tree
        </Link>
      </div>
    </div>
  );
}
