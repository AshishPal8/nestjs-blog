"use client";
import { X } from "lucide-react";
import { useState } from "react";
import { Icons } from "../shared/icons";

export function TagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    if (value.includes(tag)) return;

    onChange([...value, tag]);
    setInput("");
  };

  return (
    <div className="border rounded-lg p-2 flex flex-wrap gap-2">
      {value.map((tag) => (
        <span
          key={tag}
          className="bg-primary/10 text-primary px-2 py-1 rounded text-sm flex items-center gap-1"
        >
          #{tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="hover:text-destructive transition-colors"
          >
            <Icons.plus className="h-3 w-3 rotate-45" />
          </button>
        </span>
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            addTag(input.replace("#", ""));
          }
          if (e.key === "Backspace" && input === "") {
            e.preventDefault();
            const lastTag = value[value.length - 1];
            if (lastTag) {
              onChange(value.slice(0, -1));
              setInput(lastTag);
            }
          }
        }}
        placeholder="#add tags"
        className="outline-none flex-1"
      />
    </div>
  );
}
