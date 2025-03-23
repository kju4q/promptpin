import React from "react";
import PromptDetailClient from "./PromptDetailClient";

// Server Component
export default async function PromptDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Need to await params in Next.js 14
  const resolvedParams = await params;

  return <PromptDetailClient promptId={resolvedParams.id} />;
}
