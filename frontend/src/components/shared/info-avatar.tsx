import React from "react";
import { Post } from "@/src/types/post.types";
import Image from "next/image";
import { timeAgo } from "@/src/lib";

const InfoAvatar = ({ post }: { post: Post }) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={post?.author?.avatar || ""}
        alt={post?.author?.name || ""}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <p className="text-sm font-semibold">{post?.author?.name}</p>
        <p className="text-sm text-muted-foreground">
          {timeAgo(post?.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default InfoAvatar;
