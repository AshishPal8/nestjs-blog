import FeedLayout from "@/src/components/shared/FeedLayout";
import { GET_POST_BY_SLUG } from "@/src/graphql/queries/posts";
import { query } from "@/src/lib/apollo-server-client";
import { Post } from "@/src/types/post.types";
import { notFound } from "next/navigation";
import PostComp from "./components/post-comp";
import { Metadata } from "next";

const fetchPost = async (slug: string) => {
  const { data } = await query<{ postBySlug: Post }>({
    query: GET_POST_BY_SLUG,
    variables: { slug },
    fetchPolicy: "cache-first",
  });
  return data?.postBySlug;
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const slug = (await params).slug;
  const post = await fetchPost(slug);

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
  const post = await fetchPost(slug);

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
