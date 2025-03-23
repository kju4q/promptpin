import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="bg-gradient-to-r from-rose-400 to-amber-400 h-1"></div>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-rose-500 inline-block"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 3H5C3.89543 3 3 3.89543 3 5V15C3 16.1046 3.89543 17 5 17H7V21L12 17H19C20.1046 17 21 16.1046 21 15V5C21 3.89543 20.1046 3 19 3Z"
                fillOpacity="0.7"
              />
            </svg>
            <span className="ml-2 font-medium text-gray-800 text-sm">
              PromptPin
            </span>
          </div>

          <p className="text-xs text-gray-500 mx-2 hidden sm:block">
            Your personal Pinterest for AI prompts.
          </p>

          <div className="flex space-x-2">
            <span className="inline-block bg-rose-100 rounded-full px-2 py-0.5 text-xs font-semibold text-rose-500">
              #creativity
            </span>
            <span className="inline-block bg-amber-100 rounded-full px-2 py-0.5 text-xs font-semibold text-amber-500 hidden sm:inline-block">
              #inspiration
            </span>
            <span className="inline-block bg-pink-100 rounded-full px-2 py-0.5 text-xs font-semibold text-pink-500 hidden md:inline-block">
              #prompts
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
