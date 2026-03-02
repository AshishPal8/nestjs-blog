import FeedLayout from "@/src/components/shared/FeedLayout";
import { GET_POST_BY_SLUG } from "@/src/graphql/queries/posts";
import { getClient } from "@/src/lib/apollo-server-client";
import { Post } from "@/src/types/post.types";
import { notFound } from "next/navigation";

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;

  const { data } = await getClient().query<{ postBySlug: Post }>({
    query: GET_POST_BY_SLUG,
    variables: { slug },
  });

  if (!data?.postBySlug) return notFound();

  const post = data.postBySlug;

  return (
    <FeedLayout>
      <div>{post.title}</div>
    </FeedLayout>
  );
};

export default PostPage;
