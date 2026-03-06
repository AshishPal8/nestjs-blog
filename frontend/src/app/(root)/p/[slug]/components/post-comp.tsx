"use client";
import React, { useState } from "react";
import { Icons } from "@/src/components/shared/icons";
import InfoAvatar from "@/src/components/shared/info-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Post } from "@/src/types/post.types";
import Image from "next/image";
import SocialAction from "@/src/components/shared/social-action";
import ImageLightbox from "@/src/components/shared/image-lightbox";
import { useRouter } from "next/navigation";
import Comments from "./comments";

const PostComp = ({ post }: { post: Post }) => {
  const router = useRouter();
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icons.arrowLeft
              className="text-muted-foreground cursor-pointer"
              size={20}
              onClick={() => router.back()}
            />
            <span className="font-semibold">Post</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Icons.ellipsisVertical
                className="text-muted-foreground cursor-pointer"
                size={20}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Share</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between mb-2">
          <InfoAvatar post={post} />
        </div>
        <h1 className="font-bold text-lg">{post.title}</h1>
        <div className="">
          <div
            className="rich-text text-sm"
            dangerouslySetInnerHTML={{ __html: post.description }}
          />
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {post.images.length > 0 &&
            post.images.map((image, index) => (
              <div
                key={image.id}
                className={`relative shrink-0 snap-center rounded-lg overflow-hidden ${
                  post.images.length > 1 ? "w-[90%]" : "w-full"
                }`}
                style={{ height: "300px" }}
                onClick={(e) => {
                  e.preventDefault();
                  setLightbox({ open: true, index });
                }}
              >
                <Image
                  src={image.url}
                  fill
                  alt={`${post.title} ${index + 1}`}
                  className="object-cover cursor-pointer"
                />
              </div>
            ))}
        </div>
        <SocialAction post={post} />
        <Comments postId={post.id} />
      </div>
      <ImageLightbox
        images={post.images}
        alt={post.title}
        open={lightbox.open}
        initialIndex={lightbox.index}
        onClose={() => setLightbox({ open: false, index: 0 })}
      />
    </>
  );
};

export default PostComp;
