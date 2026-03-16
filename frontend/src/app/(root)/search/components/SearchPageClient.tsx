// app/search/components/search-page-client.tsx
"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { GET_POSTS } from "@/src/graphql/queries/posts";
import { PostsData } from "@/src/types/post.types";
import FeedCard from "@/src/components/home/feed-card";
import { SearchIcon, X } from "lucide-react";
import { useDebouncedValue } from "@/src/hooks/use-debounce-value";

const LIMIT = 10;

const SearchPageClient = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") ?? undefined;
  const searchTerm = searchParams.get("searchterm") ?? undefined;

  const [input, setInput] = useState(searchTerm ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInput(searchTerm ?? "");
  }, [searchTerm]);

  const debouncedSearch = useDebouncedValue(input, 400);

  const { data, fetchMore, loading } = useQuery<PostsData>(GET_POSTS, {
    variables: {
      pagination: {
        page: 1,
        limit: LIMIT,
        search: debouncedSearch || undefined,
        categorySlug: categorySlug || undefined,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const posts = data?.posts?.data ?? [];
  const meta = data?.posts?.meta;

  const loadMore = useCallback(() => {
    if (!meta?.hasNext || loading) return;
    fetchMore({
      variables: {
        pagination: {
          page: meta.page + 1,
          limit: LIMIT,
          search: debouncedSearch || undefined,
          categorySlug: categorySlug || undefined,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          posts: {
            ...fetchMoreResult.posts,
            data: [...prev.posts.data, ...fetchMoreResult.posts.data],
          },
        };
      },
    });
  }, [meta, loading, fetchMore, debouncedSearch, categorySlug]);

  // infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.5 },
    );
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  const clearCategory = () => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("searchterm", debouncedSearch);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setInput("");
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white">
      {/* search input */}
      <div className="sticky top-[88px] z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search posts..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
          {input && (
            <button onClick={clearSearch}>
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* active filters */}
        {(categorySlug || debouncedSearch) && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Filtering by:</span>
            {categorySlug && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                {categorySlug}
                <button onClick={clearCategory}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {debouncedSearch && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                {debouncedSearch}
                <button onClick={clearSearch}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* results */}
      {loading && posts.length === 0 ? (
        <div className="divide-y animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100" />
                <div className="h-3 bg-gray-100 rounded w-24" />
              </div>
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <SearchIcon className="h-10 w-10 text-gray-200" />
          <p className="text-sm text-muted-foreground">No posts found</p>
          {(categorySlug || debouncedSearch) && (
            <button
              onClick={() => router.push(pathname)}
              className="text-xs text-primary mt-1"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y">
          {posts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
          <div ref={loadMoreRef} className="h-10" />
          {loading && (
            <p className="text-center text-xs text-muted-foreground py-4">
              Loading more...
            </p>
          )}
          {!meta?.hasNext && posts.length > 0 && (
            <p className="text-center text-xs text-muted-foreground py-4">
              You&apos;ve seen it all
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPageClient;
