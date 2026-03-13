"use client";
import React, { useState, useEffect, useRef } from "react";
import { Post } from "@/src/types/post.types";
import Image from "next/image";
import Link from "next/link";
import InfoAvatar from "../shared/info-avatar";
import { Icons } from "../shared/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ImageLightbox from "../shared/image-lightbox";
import SocialAction from "../shared/social-action";

function PostDescription({ html, slug }: { html: string; slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setTruncated(el.scrollHeight > el.clientHeight);
  }, []);

  return (
    <Link href={`/p/${slug}`}>
      <div className="text-sm cursor-pointer">
        <div
          ref={ref}
          className="rich-text line-clamp-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {truncated && (
          <span className="text-blue-500 font-medium"> ...more</span>
        )}
      </div>
    </Link>
  );
}

const FeedCard = ({ post }: { post: Post }) => {
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });
  return (
    <div className="border-b">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <InfoAvatar post={post} />
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
        <h1 className="font-bold text-lg">{post.title}</h1>
        <PostDescription html={post.description} slug={post.slug} />
        <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {post.images.length > 0 &&
            post.images.map((image, index) => (
              <div
                key={image.id}
                className="relative shrink-0 snap-center rounded-lg overflow-hidden"
                onClick={(e) => {
                  e.preventDefault();
                  setLightbox({ open: true, index });
                }}
              >
                <Image
                  src={image.url}
                  width={800}
                  height={600}
                  alt={`${post.title} ${index + 1}`}
                  className="h-[300px] w-auto object-contain rounded-lg cursor-pointer"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
        </div>
        <SocialAction post={post} />
      </div>

      <ImageLightbox
        images={post.images}
        alt={post.title}
        open={lightbox.open}
        initialIndex={lightbox.index}
        onClose={() => setLightbox({ open: false, index: 0 })}
      />
    </div>
  );
};

export default FeedCard;
