"use client";
import { useState } from "react";

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
          className="bg-primary/10 text-primary px-2 py-1 rounded text-sm"
        >
          #{tag}
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
        }}
        placeholder="#add tags"
        className="outline-none flex-1"
      />
    </div>
  );
}
