import { Suspense } from "react"; // remove "use client"
import InfoAvatar from "@/src/components/shared/info-avatar";
import { Post } from "@/src/types/post.types";
import SocialAction from "@/src/components/shared/social-action";
import { CommentsSkeleton } from "@/src/components/skeletons/comment-skeleton";
import PostHeader from "./post-header";
import PostImages from "./post-images";
import Comments from "./comments";

const PostComp = ({ post }: { post: Post }) => {
  return (
    <>
      <div className="p-4">
        <PostHeader />
        <div className="flex items-center justify-between mb-2">
          <InfoAvatar post={post} />
        </div>
        <h1 className="font-bold text-lg">{post.title}</h1>
        <div
          className="rich-text text-sm"
          dangerouslySetInnerHTML={{ __html: post.description }}
        />
        <PostImages images={post.images} title={post.title} />
        <SocialAction post={post} />
        <Suspense fallback={<CommentsSkeleton />}>
          <Comments postId={post.id} />
        </Suspense>
      </div>
    </>
  );
};

export default PostComp;
