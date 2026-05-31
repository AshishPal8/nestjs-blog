"use client";

import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Separator } from "@/src/components/ui/separator";
import { PostColumn, columns } from "./columns";
import DataTable from "@/src/components/ui/data-table";
import Pagination from "@/src/components/shared/pagination";
import { useQuery } from "@apollo/client/react";
import { format } from "date-fns";
import { GET_POSTS } from "@/src/graphql/queries/posts";
import PostFilters from "./post-filters";

interface PostResponse {
  posts: {
    data: PostColumn[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}
export const PostClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const { data, loading, refetch, error } = useQuery<PostResponse>(GET_POSTS, {
    variables: {
      pagination: { page, limit, search: search || undefined },
    },
    fetchPolicy: "network-only",
  });

  console.log({ data });

  useEffect(() => {
    refetch({
      pagination: {
        page,
        limit,
        search: search || undefined,
      },
    });
  }, [page, limit, search, refetch]);

  const tableData: PostColumn[] =
    data?.posts.data.map((post) => ({
      id: post.id,
      title: post.title,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      isActive: post.isActive || false,
      createdAt: format(post.createdAt, "dd-MM-yyyy"),
    })) || [];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Blogs (${data?.posts.meta?.total ?? 0})`}
          description="Manage blogs"
        />
        <Button onClick={() => router.push(`/dashboard/blogs/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <PostFilters />
      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center py-10">
          <p className="text-red-500">Error loading blogs: {error.message}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <DataTable columns={columns} data={tableData} />
          {data?.posts.meta && (
            <Pagination
              currentPage={data.posts.meta.page}
              totalPages={data.posts.meta.totalPages}
            />
          )}
        </>
      )}
    </>
  );
};
