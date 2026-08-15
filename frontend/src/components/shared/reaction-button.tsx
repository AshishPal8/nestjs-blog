"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
import { cn } from "@/src/lib/utils";

interface ReactionButtonProps {
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
  activeClassName: string;
  idleClassName: string;
  animationSrc: StaticImageData;
  animationDurationMs: number;
  size?: number;
  className?: string;
}

const ReactionButton = ({
  icon: Icon,
  active,
  onClick,
  activeClassName,
  idleClassName,
  animationSrc,
  animationDurationMs,
  size = 24,
  className,
}: ReactionButtonProps) => {
  const [bursting, setBursting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    const wasActive = active;
    onClick();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!wasActive) {
      setBursting(true);
      timeoutRef.current = setTimeout(
        () => setBursting(false),
        animationDurationMs,
      );
    } else {
      setBursting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span
      onClick={handleClick}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center cursor-pointer",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Icon
        size={size}
        className={cn(
          "transition-transform duration-150",
          active ? activeClassName : idleClassName,
          bursting && "opacity-0",
        )}
      />
      {bursting && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={animationSrc.src}
            alt=""
            aria-hidden="true"
            className="pointer-events-none max-w-none"
            style={{ width: size * 4, height: size * 4 }}
          />
        </span>
      )}
    </span>
  );
};

export default ReactionButton;
