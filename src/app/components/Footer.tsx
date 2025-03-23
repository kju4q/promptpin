import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-pink-100 mt-8">
      <div className="bg-gradient-to-r from-rose-400 to-amber-400 h-1"></div>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-rose-500 inline-block"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 3H5C3.89543 3 3 3.89543 3 5V15C3 16.1046 3.89543 17 5 17H7V21L12 17H19C20.1046 17 21 16.1046 21 15V5C21 3.89543 20.1046 3 19 3Z"
                fillOpacity="0.7"
              />
            </svg>
            <span className="ml-2 font-medium text-gray-800">PromptPin</span>
          </div>

          <p className="text-sm text-gray-600 max-w-md mb-4">
            A cozy corner of the internet for collecting and sharing your
            favorite AI prompts.
          </p>

          <div className="flex space-x-4 mb-4">
            <span className="inline-block bg-rose-100 rounded-full px-3 py-1 text-xs font-semibold text-rose-500">
              #creativity
            </span>
            <span className="inline-block bg-amber-100 rounded-full px-3 py-1 text-xs font-semibold text-amber-500">
              #inspiration
            </span>
            <span className="inline-block bg-pink-100 rounded-full px-3 py-1 text-xs font-semibold text-pink-500">
              #prompts
            </span>
          </div>

          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} PromptPin • All the good vibes
          </p>
        </div>
      </div>
    </footer>
  );
}
