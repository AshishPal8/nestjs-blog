"use client";

import { useState } from "react";
import { Category } from "@/src/types/category.types";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/ui/hover-card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { Input } from "@/src/components/ui/input";
import { SearchIcon, ChevronDownIcon } from "lucide-react";

const VISIBLE_COUNT = 8;
const COLUMN_SIZE = 5;

const CategoryStrip = ({ categories }: { categories: Category[] }) => {
  const [search, setSearch] = useState("");

  const visible = categories.slice(0, VISIBLE_COUNT);
  const hidden = categories.slice(VISIBLE_COUNT);

  const columns: Category[][] = [];
  for (let i = 0; i < hidden.length; i += COLUMN_SIZE) {
    columns.push(hidden.slice(i, i + COLUMN_SIZE));
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-muted py-2 border-b border-border">
      {/* ── DESKTOP ── */}
      <div className="hidden md:flex w-full px-5 lg:px-16 items-center gap-5">
        {visible.map((category) => (
          <Link href={`/search?category=${category.slug}`} key={category.id}>
            <span className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer">
              {category.name}
            </span>
          </Link>
        ))}

        {hidden.length > 0 && (
          <HoverCard openDelay={100} closeDelay={100}>
            <HoverCardTrigger asChild>
              <span className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer select-none">
                More ▾
              </span>
            </HoverCardTrigger>
            <HoverCardContent align="start" className="w-auto p-3">
              <div className="flex gap-6">
                {columns.map((col, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-2">
                    {col.map((category) => (
                      <Link
                        href={`/search?category=${category.slug}`}
                        key={category.id}
                      >
                        <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer whitespace-nowrap block">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>

      {/* ── MOBILE ── */}
      <div className="flex md:hidden w-full px-4 items-center">
        <Drawer>
          <DrawerTrigger asChild>
            <button className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              Categories
              <ChevronDownIcon className="size-4" />
            </button>
          </DrawerTrigger>

          <DrawerContent className="px-4 pb-8">
            <DrawerHeader>
              <DrawerTitle>Categories</DrawerTitle>
            </DrawerHeader>

            {/* search */}
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 mb-4">
              <SearchIcon className="size-4 text-muted-foreground shrink-0" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="border-none shadow-none focus-visible:ring-0 p-0 h-auto text-sm"
              />
            </div>

            {/* list */}
            <div className="min-h-72 flex flex-col gap-1 max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No categories found
                </p>
              ) : (
                filtered.map((category) => (
                  <Link
                    href={`/search?category=${category.slug}`}
                    key={category.id}
                  >
                    <span className="block text-sm font-medium px-2 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                      {category.name}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default CategoryStrip;
