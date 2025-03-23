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

        {/* Icons - Only Heart and User Avatar */}
        <div className="flex items-center gap-3">
          <Link href="/saved" className="p-2 rounded-full hover:bg-gray-100">
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

          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
            {/* Profile image placeholder */}
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
