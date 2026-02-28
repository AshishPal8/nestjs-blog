"use client";
import React from "react";
import { Post } from "@/src/types/post.types";
import Image from "next/image";

const FeedCard = ({ post }: { post: Post }) => {
  console.log("post", post);
  return (
    <div className="p-4 border-b">
      <h1 className="font-bold text-lg">{post.title}</h1>
      <div className="">
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: post.description }}
        />
      </div>
      <div className="mt-2">
        <Image
          src={post.images[0].url}
          width={500}
          height={500}
          alt={post.title}
          className="rounded-lg object-cover"
        />
      </div>
    </div>
  );
};

export default FeedCard;
