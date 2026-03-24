import FeedLayout from "@/src/components/shared/FeedLayout";
import { GET_POST_BY_SLUG } from "@/src/graphql/queries/posts";
import { publicQuery } from "@/src/lib/apollo-server-client";
import { Post } from "@/src/types/post.types";
import { notFound } from "next/navigation";
import PostComp from "./components/post-comp";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { envConfig } from "@/src/config/env.config";

const fetchPost = unstable_cache(
  async (slug: string, authCookie: string | null) => {
    const { data } = await publicQuery<{ postBySlug: Post }>(
      {
        query: GET_POST_BY_SLUG,
        variables: { slug },
      },
      authCookie,
    );
    return data?.postBySlug ?? null;
  },
  ["post-by-slug"],
  { revalidate: 60, tags: ["post"] },
);
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const slug = (await params).slug;
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(envConfig.authCookieName)?.value ?? null;

  const post = await fetchPost(slug, authCookie);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const postImage = post.images?.[0]?.url || `${baseUrl}/og-default.jpg`;
  const cleanDescription =
    post.metaDescription?.replace(/<[^>]*>/g, "") ||
    post.description?.replace(/<[^>]*>/g, "");

  return {
    title: post.title,
    description: cleanDescription,
    openGraph: {
      title: post.title,
      description: cleanDescription,
      type: "article",
      url: `${baseUrl}/posts/${post.slug}`,
      images: [
        {
          url: postImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      authors: [post.author?.name || "Unknown Author"],
      publishedTime: post.createdAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: cleanDescription,
      images: [postImage],
    },
    keywords: post.tags?.map((tag: any) => tag.name).join(", "),
    authors: [{ name: post.author?.name || "Unknown Author" }],
  };
};

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(envConfig.authCookieName)?.value ?? null;

  const post = await fetchPost(slug, authCookie);

  if (!post) return notFound();

  return (
    <FeedLayout>
      <div className="w-full mx-auto bg-white rounded-md">
        <PostComp post={post} />
      </div>
    </FeedLayout>
  );
};

export default PostPage;
