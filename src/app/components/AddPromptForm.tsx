import { useState } from "react";
import { Prompt } from "../data/prompts";

interface AddPromptFormProps {
  onAdd: (prompt: Omit<Prompt, "id">) => void;
  onCancel: () => void;
}

export default function AddPromptForm({ onAdd, onCancel }: AddPromptFormProps) {
  const [title, setTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [exampleOutput, setExampleOutput] = useState("");
  const [category, setCategory] = useState("General");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !promptText) {
      return;
    }

    onAdd({
      title,
      promptText,
      exampleOutput,
      category,
      isSaved: false,
    });

    setTitle("");
    setPromptText("");
    setExampleOutput("");
    setCategory("General");
  };

  const categories = [
    "General",
    "Business",
    "Development",
    "Marketing",
    "Design",
    "Content Creation",
    "Data",
    "Education",
    "Entertainment",
    "Lifestyle",
    "Professional",
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto border border-zinc-200">
        <div className="p-7">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="mb-2 inline-flex items-center py-1 px-2.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium border border-zinc-200">
                <span className="mr-1">✏️</span> Create
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Add Your Prompt
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded-full"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white transition-all"
                placeholder="e.g., Email Subject Line Generator"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white appearance-none pr-10 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="promptText"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Prompt Text
              </label>
              <textarea
                id="promptText"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white min-h-[120px] transition-all"
                placeholder="Enter your prompt text here..."
                required
              />
            </div>

            <div>
              <label
                htmlFor="exampleOutput"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Example Output (optional)
              </label>
              <textarea
                id="exampleOutput"
                value={exampleOutput}
                onChange={(e) => setExampleOutput(e.target.value)}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white min-h-[120px] transition-all"
                placeholder="Add an example of what this prompt might generate..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!title || !promptText}
              >
                <span className="flex items-center gap-1.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Prompt
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
