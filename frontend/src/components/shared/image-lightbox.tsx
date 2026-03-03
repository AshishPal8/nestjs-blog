"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageLightboxProps {
  images: { id: number; url: string }[];
  alt: string;
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

const ImageLightbox = ({
  images,
  alt,
  initialIndex = 0,
  open,
  onClose,
}: ImageLightboxProps) => {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (open) setCurrent(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")
        setCurrent((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setCurrent((i) => (i + 1) % images.length);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, images.length, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* backdrop blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* popup */}
      <div
        className="relative z-10 w-[95vw] max-w-2xl rounded-xl overflow-hidden bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* image */}
        <div className="relative w-full h-[60vh] sm:h-[70vh]">
          <Image
            src={images[current].url}
            fill
            alt={`${alt} ${current + 1}`}
            className="object-contain"
            priority
            sizes="95vw"
          />

          {/* close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrent((i) => (i - 1 + images.length) % images.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrent((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 py-3 bg-black">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === current ? "w-5 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageLightbox;
