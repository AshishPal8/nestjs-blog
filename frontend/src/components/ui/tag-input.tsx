"use client";
import { X } from "lucide-react";
import { useState } from "react";
import { Icons } from "../shared/icons";
import { SEARCH_TAGS } from "@/src/graphql/queries/tags";
import { useQuery } from "@apollo/client/react";

export function TagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data } = useQuery(SEARCH_TAGS, {
    variables: { input: { search: input } },
    skip: input.length < 1,
    fetchPolicy: "cache-first",
  });

  const suggestions = data?.searchTags ?? [];

  const addTag = (tag: string) => {
    const clean = tag.replace("#", "").trim();
    if (!clean || value.includes(clean)) return;
    onChange([...value, clean]);
    setInput("");
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="relative">
      <div className="border rounded-lg p-2 flex flex-wrap gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="bg-primary/10 text-primary px-2 py-1 rounded text-sm flex items-center gap-1"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-destructive transition-colors"
            >
              <Icons.plus className="h-3 w-3 rotate-45" />
            </button>
          </span>
        ))}

        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              addTag(input);
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
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onFocus={() => input && setShowSuggestions(true)}
          placeholder="#add tags"
          className="outline-none flex-1"
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-lg shadow-md overflow-hidden">
          {suggestions.map((tag: { id: number; name: string }) => (
            <button
              key={tag.id}
              type="button"
              onMouseDown={() => addTag(tag.name)} // mousedown fires before blur
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              #{tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
