import FeedLayout from "@/src/components/shared/FeedLayout";
import { Post } from "@/src/types/post.types";
import { notFound } from "next/navigation";
import PostComp from "./components/post-comp";
import { getPostBySlug } from "@/src/lib/data/post";

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const post = (await getPostBySlug((await params).slug)) as Post;

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
