"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SocialLinks() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const socialLinks = [
    {
      id: "twitter",
      url: "https://x.com/kjut4q",
      label: "Twitter",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      hoverColor: "hover:text-blue-400",
    },
    {
      id: "farcaster",
      url: "https://warpcast.com/qendresa",
      label: "Farcaster",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M11.247 2.05c-.156.256-3.241 5.698-3.307 5.81-.043.066-.134.097-.22.097H4.3c-.09 0-.177-.035-.22-.097C4.014 7.748.929 2.306.773 2.05a.398.398 0 0 0-.22-.104c-.047 0-.133.014-.215.09C.181 2.132 0 2.233 0 2.61v18.126c0 .562.13.878.234.983.105.105.379.281.91.281h3.358c.523 0 .793-.176.898-.281.104-.105.234-.421.234-.983v-7.269c0-.09.086-.172.172-.172h.765c.09 0 .172.082.172.172l3.2 7.384c.259.605.55.969.879 1.129.34.16.803.18 1.388.176h3.09c.531 0 .8-.176.906-.281.105-.105.234-.421.234-.983V2.61c0-.378-.18-.479-.332-.574a.36.36 0 0 0-.215-.09.398.398 0 0 0-.218.105z" />
        </svg>
      ),
      hoverColor: "hover:text-purple-500",
    },
    {
      id: "website",
      url: "https://qendresa.dev/",
      label: "Portfolio",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      hoverColor: "hover:text-emerald-500",
    },
  ];

  return (
    <div className="py-4 relative mb-6">
      <div className="flex items-center justify-center gap-8 relative">
        {socialLinks.map((social) => (
          <Link
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-gray-600 transform transition-all duration-300 ${
              social.hoverColor
            } ${
              hoveredIcon === social.id
                ? "scale-125 rotate-6"
                : hoveredIcon
                ? "scale-90 opacity-70"
                : ""
            }`}
            onMouseEnter={() => setHoveredIcon(social.id)}
            onMouseLeave={() => setHoveredIcon(null)}
            aria-label={social.label}
          >
            {social.icon}
            <span className="sr-only">{social.label}</span>
          </Link>
        ))}
      </div>

      {/* Animated label that appears on hover */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 mt-2 transition-opacity duration-300">
        {hoveredIcon && (
          <span
            className="text-xs px-2 py-1 bg-gray-900 text-white rounded-md opacity-80 animate-fadeIn"
            style={{ animationDuration: "0.2s" }}
          >
            {socialLinks.find((s) => s.id === hoveredIcon)?.label || ""}
          </span>
        )}
      </div>

      {/* Subtle connector line */}
      <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mt-4"></div>
    </div>
  );
}
