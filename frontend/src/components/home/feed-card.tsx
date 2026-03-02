"use client";
import React from "react";
import { Post } from "@/src/types/post.types";
import Image from "next/image";
import Link from "next/link";

const FeedCard = ({ post }: { post: Post }) => {
  return (
    <div>
      <Link href={`/p/${post.slug}`}>
        <div className="p-4 border-b">
          <h1 className="font-bold text-lg">{post.title}</h1>
          <div className="">
            <div
              className="rich-text text-sm"
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
      </Link>
    </div>
  );
};

export default FeedCard;
