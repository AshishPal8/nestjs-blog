import { MetadataRoute } from "next";
import { client } from "@/src/lib/apollo-client";
import { GET_POSTS } from "@/src/graphql/queries/posts";
import { PostsData } from "@/src/types/post.types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];

  try {
    const { data } = await client.query<PostsData>({
      query: GET_POSTS,
      variables: { pagination: { page: 1, limit: 99 } },
      fetchPolicy: "no-cache",
    });

    const posts = data?.posts?.data ?? [];

    const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/p/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...postUrls];
  } catch (error) {
    console.error("Sitemap error:", error);
    return staticRoutes;
  }
}
