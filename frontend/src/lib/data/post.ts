import { cache } from "react";
import { query } from "@/src/lib/apollo-server-client";
import { GET_POSTS, GET_POST_BY_SLUG } from "@/src/graphql/queries/posts";

export const getPosts = cache(async () => {
  const { data } = await query({
    query: GET_POSTS,
    variables: { pagination: { page: 1, limit: 10 } },
  });

  return data;
});

export const getPostBySlug = cache(async (slug: string) => {
  const { data } = await query({
    query: GET_POST_BY_SLUG,
    variables: { slug },
  });

  return data?.postBySlug;
});
