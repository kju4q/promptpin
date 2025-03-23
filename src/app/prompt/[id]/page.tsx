import React from "react";
import PromptDetailClient from "./PromptDetailClient";

// Define the correct interface for Next.js 15 params
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Server Component
export default async function PromptDetailPage({ params }: PageProps) {
  // Need to await params in Next.js 15
  const resolvedParams = await params;
  const promptId = resolvedParams.id as string;

  return <PromptDetailClient promptId={promptId} />;
}
