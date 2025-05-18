"use client";

import React from "react";
import Header from "../components/Header";

export default function GithubPage() {
  return (
    <div className="flex flex-col h-screen relative">
      <div className="fixed inset-0 z-0 bg-white/60 backdrop-blur-sm" />
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 min-h-screen">
        {/* Modal */}
        <div className="px-8 py-6 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
            GitHub prompts are on the way
          </h2>
          <p className="text-gray-500 text-center">
            We’re indexing the best dev workflows, prompt chains, and automation
            tricks. Shipping soon.
          </p>
        </div>
        {/* Card shadows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl px-4 mt-12">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white rounded-xl shadow-lg border border-gray-100 opacity-60"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
