import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PromptPin | Discover, Save, and Create AI Prompts",
  description:
    "A Pinterest-style platform for discovering, saving, and creating AI prompts",
  keywords:
    "AI, prompts, ChatGPT, Claude, Pinterest, collection, prompt engineering",
  authors: [{ name: "PromptPin Team" }],
  openGraph: {
    title: "PromptPin | Discover & Save AI Prompts",
    description:
      "A Pinterest-style platform for discovering, saving, and creating AI prompts",
    url: "https://promptpin.app",
    siteName: "PromptPin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PromptPin",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} h-screen flex flex-col bg-neutral-50`}
        suppressHydrationWarning={true}
      >
        <div className="animate-fadeIn flex-grow flex flex-col">
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
