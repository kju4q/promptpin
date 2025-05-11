"use client";

import React from "react";
import Header from "../components/Header";

export default function InfoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            How It Works
          </h1>

          <div className="space-y-8">
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What We Do
              </h2>
              <p className="text-gray-600 mb-4">
                AI prompt discovery engine powered by TikTok's creator
                community. We surface the most valuable AI prompts from trending
                content.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-rose-50 p-4 rounded-lg">
                  <h3 className="font-medium text-rose-800 mb-2">
                    For AI Enthusiasts
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Ready-to-use prompts for ChatGPT, DALL-E, Midjourney, and
                    more.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">
                    For Content Creators
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Trending AI prompts and inspiration from the community.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                How We Find Prompts
              </h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="font-medium mr-2">1.</span>
                  <span>Search trending TikTok videos</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium mr-2">2.</span>
                  <span>Filter AI-related content</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium mr-2">3.</span>
                  <span>
                    Extract from descriptions, comments, or generate new
                  </span>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Prompt Quality
              </h2>
              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>No spam</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>No hashtags</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Action-oriented</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>No duplicates</span>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Using the Prompts
              </h2>
              <p className="text-gray-600 mb-4">Each prompt includes:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>The prompt text you can copy and use</li>
                <li>The original video author for attribution</li>
                <li>The source type (description/comment/generated)</li>
                <li>A link to the original video</li>
              </ul>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Technical Process
              </h2>
              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <div>
                  <span className="font-medium block mb-1">
                    API Integration
                  </span>
                  <span className="text-sm">Real-time TikTok data</span>
                </div>
                <div>
                  <span className="font-medium block mb-1">NLP Processing</span>
                  <span className="text-sm">Smart text analysis</span>
                </div>
                <div>
                  <span className="font-medium block mb-1">AI Generation</span>
                  <span className="text-sm">Creative prompts</span>
                </div>
                <div>
                  <span className="font-medium block mb-1">Local Storage</span>
                  <span className="text-sm">Browser-based saving</span>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Data Flow
              </h2>
              <div className="flex items-center justify-between text-gray-600">
                <div className="text-center">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-rose-600 font-medium">1</span>
                  </div>
                  <span className="text-sm">Collect</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-rose-600 font-medium">2</span>
                  </div>
                  <span className="text-sm">Process</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-rose-600 font-medium">3</span>
                  </div>
                  <span className="text-sm">Deliver</span>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Saving Prompts
              </h2>
              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-rose-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>Save favorites</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-rose-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Coming soon</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
