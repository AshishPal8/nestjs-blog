import FeedLayout from "@/src/components/shared/FeedLayout";
import { GET_POST_BY_SLUG } from "@/src/graphql/queries/posts";
import { query } from "@/src/lib/apollo-server-client";
import { Post } from "@/src/types/post.types";
import { notFound } from "next/navigation";
import PostComp from "./components/post-comp";

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;

  const { data } = await query<{ postBySlug: Post }>({
    query: GET_POST_BY_SLUG,
    variables: { slug },
    fetchPolicy: "cache-first",
  });

  if (!data?.postBySlug) return notFound();

  return (
    <FeedLayout>
      <div className="w-full mx-auto bg-white rounded-md">
        <PostComp post={data.postBySlug} />
      </div>
    </FeedLayout>
  );
};

export default PostPage;
