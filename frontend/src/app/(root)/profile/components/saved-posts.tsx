"use client";

import { useQuery } from "@apollo/client/react";
import { GET_MY_BOOKMARKS } from "@/src/graphql/queries/bookmarks";
import FeedCard from "@/src/components/home/feed-card";
import { Bookmark } from "lucide-react";
import { Post } from "@/src/types/post.types";

interface BookmarksData {
  myBookmarks: {
    data: Post[];
    meta: {
      total: number;
      hasNext: boolean;
    };
  };
}

const SavedPosts = () => {
  const { data, loading } = useQuery<BookmarksData>(GET_MY_BOOKMARKS, {
    variables: { pagination: { page: 1, limit: 20 } },
    fetchPolicy: "cache-and-network",
  });

  const posts = data?.myBookmarks?.data ?? [];

  if (loading && posts.length === 0) {
    return (
      <div className="divide-y animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted" />
              <div className="h-3 bg-muted rounded w-24" />
            </div>
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Bookmark className="h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No saved posts yet</p>
        <p className="text-xs text-muted-foreground/60">
          Tap the bookmark icon on any post to save it
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {posts.map((post) => (
        <FeedCard key={post.id} post={post} /> // ✅ properly typed now
      ))}
    </div>
  );
};

export default SavedPosts;
