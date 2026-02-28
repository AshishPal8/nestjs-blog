"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { GET_POSTS } from "@/src/graphql/queries/posts";
import { PostsData } from "@/src/types/post.types";
import { useQuery } from "@apollo/client/react";
import FeedCard from "./feed-card";

const LIMIT = 10;

const Feed = ({ initialData }: { initialData: PostsData }) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchMore, loading } = useQuery<PostsData>(GET_POSTS, {
    variables: { pagination: { page: 1, limit: LIMIT } },
    fetchPolicy: "cache-first",
  });

  const posts = data?.posts.data ?? initialData?.posts?.data ?? [];
  const meta = data?.posts.meta ?? initialData?.posts?.meta;

  const loadMore = useCallback(() => {
    if (!meta?.hasNext || loading) return;

    fetchMore({
      variables: {
        pagination: { page: meta.page + 1, limit: LIMIT },
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
  }, [meta, loading, fetchMore]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.5 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {posts.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}

      <div ref={loadMoreRef} className="h-10" />

      {loading && (
        <p className="text-center text-sm text-muted-foreground">Loading...</p>
      )}

      {!meta?.hasNext && posts.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          You&apos;re all caught up
        </p>
      )}
    </div>
  );
};

export default Feed;
