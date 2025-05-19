"use client";

import React from "react";
import Header from "../../../components/Header";
import PromptTreeTooltip from "../../../components/PromptTreeTooltip";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function PromptTreePage() {
  const params = useParams();
  const pathname = usePathname();
  const promptId = params.id;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
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
      <main className="flex-1">
        <div className="max-w-4xl w-full mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Prompt Tree
            </h2>
            <PromptTreeTooltip />
          </div>
        </div>
      </main>
    </div>
  );
}
