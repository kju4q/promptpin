"use client";

import React from "react";

interface ComingSoonCardProps {
  title: string;
  description: string;
  showShadows?: boolean;
}

export default function ComingSoonCard({
  title,
  description,
  showShadows = true,
}: ComingSoonCardProps) {
  return (
    <>
      <div className="px-8 py-6 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
          {title}
        </h2>
        <p className="text-gray-500 text-center">{description}</p>
      </div>
      {showShadows && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl px-4 mt-12">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white rounded-xl shadow-lg border border-gray-100 opacity-60"
            />
          ))}
        </div>
      )}
    </>
  );
}
