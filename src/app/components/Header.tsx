import React from "react";
import Link from "next/link";

type HeaderProps = {
  onAddClick?: () => void;
};

export default function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Custom Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="h-8 w-8 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 3H5C3.89543 3 3 3.89543 3 5V15C3 16.1046 3.89543 17 5 17H7V21L12 17H19C20.1046 17 21 16.1046 21 15V5C21 3.89543 20.1046 3 19 3Z"
                fill="#F43F5E"
                stroke="#F43F5E"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6L12 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9" r="1" fill="white" />
            </svg>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center">
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-rose-500">
              Home
            </Link>
            <Link href="/saved" className="text-gray-600 hover:text-rose-500">
              Saved
            </Link>
            <Link href="/tiktok" className="text-gray-600 hover:text-rose-500">
              TikTok
            </Link>
          </div>
          <div className="ml-6 pl-6 border-l border-gray-200">
            <Link
              href="/info"
              className="text-gray-600 hover:text-rose-500 flex items-center"
            >
              <span>How It Works</span>
              <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                New
              </span>
            </Link>
          </div>
        </div>

        {/* Icons - Only Heart and User Avatar */}
        <div className="flex items-center gap-3">
          <Link
            href="/saved"
            className="p-2 rounded-full hover:bg-gray-100 md:hidden"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Link>

          <Link
            href="/tiktok"
            className="p-2 rounded-full hover:bg-gray-100 md:hidden"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </Link>

          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
