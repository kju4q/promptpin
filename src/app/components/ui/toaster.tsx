"use client";

import { useToast } from "./toast-provider";

export function Toaster() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-lg flex items-center ${
            toast.variant === "destructive" ? "text-red-400" : ""
          }`}
        >
          {toast.title}
          {toast.description && (
            <span className="ml-2 text-sm text-gray-300">
              {toast.description}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
