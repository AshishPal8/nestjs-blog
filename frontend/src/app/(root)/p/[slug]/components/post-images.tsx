"use client";
import { useState } from "react";
import Image from "next/image";
import ImageLightbox from "@/src/components/shared/image-lightbox";

const PostImages = ({ images, title }: { images: any[]; title: string }) => {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  if (!images?.length) return null;

  return (
    <>
      <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative shrink-0 snap-center rounded-lg overflow-hidden ${
              images.length > 1 ? "w-[90%]" : "w-full"
            }`}
            style={{ height: "300px" }}
            onClick={() => setLightbox({ open: true, index })}
          >
            <Image
              src={image.url}
              fill
              alt={`${title} ${index + 1}`}
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover cursor-pointer"
            />
          </div>
        ))}
      </div>
      <ImageLightbox
        images={images}
        alt={title}
        open={lightbox.open}
        initialIndex={lightbox.index}
        onClose={() => setLightbox({ open: false, index: 0 })}
      />
    </>
  );
};

export default PostImages;
