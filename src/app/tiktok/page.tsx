"use client";

import React, { useEffect, useState } from "react";
import {
  TikTokVideo,
  fetchVideosByMultipleHashtags,
  extractPromptsFromVideo,
} from "../utils/tiktok/tikApiService";
import { useToast } from "../components/ui/toast-provider";
import Header from "../components/Header";

export default function TikTokPage() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [extractedPrompts, setExtractedPrompts] = useState<
    Array<{
      text: string;
      video: TikTokVideo;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([
    "chatgpt",
    "ai",
    "tech",
    "prompts",
  ]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const fetchedVideos = await fetchVideosByMultipleHashtags(
        selectedHashtags,
        5
      );
      setVideos(fetchedVideos);

      // Extract prompts from videos
      const allPrompts: Array<{ text: string; video: TikTokVideo }> = [];
      fetchedVideos.forEach((video) => {
        const prompts = extractPromptsFromVideo(video);
        prompts.forEach((prompt) => {
          allPrompts.push({ text: prompt, video });
        });
      });

      setExtractedPrompts(allPrompts);

      if (fetchedVideos.length === 0) {
        toast({
          title: "No videos found",
          description: "Try different hashtags or check your API key",
        });
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error",
        description: "Failed to fetch TikTok videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchVideos();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            TikTok Prompts
          </h1>
          <p className="text-gray-600 mb-6">
            Discover AI prompts from TikTok videos with hashtags like #chatgpt,
            #ai, #tech, and #prompts.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedHashtags.map((hashtag) => (
              <span
                key={hashtag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                #{hashtag}
              </span>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extractedPrompts.length === 0 ? (
              <div className="col-span-full bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">
                  No prompts found. Try refreshing the page.
                </p>
              </div>
            ) : (
              extractedPrompts.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <p className="text-gray-800 mb-4 whitespace-pre-wrap">
                      {item.text}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>@{item.video.author.unique_id}</span>
                      <a
                        href={item.video.share_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View on TikTok
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
