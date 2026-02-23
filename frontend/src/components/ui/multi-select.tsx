"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, XIcon, SearchIcon } from "lucide-react";
import { Popover } from "radix-ui";
import { cn } from "@/src/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  maxDisplay?: number;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  maxDisplay = 3,
  disabled = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (val: string) => {
    const next = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onValueChange?.(next);
  };

  const removeOne = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.(value.filter((v) => v !== val));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.([]);
  };

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[];

  const overflowCount = selectedLabels.length - maxDisplay;
  const displayedLabels = selectedLabels.slice(0, maxDisplay);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            "border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50",
            "flex min-h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-1.5 text-sm shadow-xs transition-[color,box-shadow] outline-none",
            "focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          {/* Selected badges */}
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedLabels.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {displayedLabels.map((label) => {
                  const opt = options.find((o) => o.label === label)!;
                  return (
                    <span
                      key={opt.value}
                      className="bg-accent text-accent-foreground inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-medium"
                    >
                      {label}
                      <button
                        type="button"
                        onClick={(e) => removeOne(opt.value, e)}
                        className="hover:text-destructive ml-0.5 rounded-full outline-none"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </span>
                  );
                })}
                {overflowCount > 0 && (
                  <span className="bg-muted text-muted-foreground inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium">
                    +{overflowCount} more
                  </span>
                )}
              </>
            )}
          </div>

          {/* Right side: clear + chevron */}
          <div className="flex shrink-0 items-center gap-1">
            {value.length > 0 && (
              <span
                role="button"
                tabIndex={0}
                onClick={clearAll}
                onKeyDown={(e) => e.key === "Enter" && clearAll(e as any)}
                className="text-muted-foreground hover:text-foreground rounded-full outline-none"
              >
                <XIcon className="size-3.5" />
              </span>
            )}
            <ChevronDownIcon
              className={cn(
                "text-muted-foreground size-4 opacity-50 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </div>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={4}
          className={cn(
            "bg-popover text-popover-foreground z-50 min-w-(--radix-popover-trigger-width) rounded-md border shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2",
          )}
        >
          {/* Search */}
          <div className="border-b px-2 py-1.5">
            <div className="flex items-center gap-2">
              <SearchIcon className="text-muted-foreground size-3.5 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                No options found.
              </p>
            ) : (
              filtered.map((opt) => {
                const selected = value.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => toggle(opt.value)}
                    className={cn(
                      "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none",
                      "hover:bg-accent hover:text-accent-foreground transition-colors",
                      "disabled:pointer-events-none disabled:opacity-50",
                      selected && "bg-accent/50",
                    )}
                  >
                    {/* Checkbox */}
                    <span
                      className={cn(
                        "border-input flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                        selected &&
                          "bg-primary border-primary text-primary-foreground",
                      )}
                    >
                      {selected && <CheckIcon className="size-3" />}
                    </span>
                    {opt.label}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer: select all / clear */}
          {options.length > 0 && (
            <div className="border-t px-2 py-1.5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  onValueChange?.(
                    options.filter((o) => !o.disabled).map((o) => o.value),
                  )
                }
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => onValueChange?.([])}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
