"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { DarkLogo, LightLogo } from "@/src/assets";
import { cn } from "@/src/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center h-7 sm:h-8", className)}
    >
      {mounted ? (
        <Image
          src={resolvedTheme === "dark" ? DarkLogo : LightLogo}
          alt="Blogapp"
          width={169}
          height={32}
          className="h-full w-auto"
          priority
        />
      ) : (
        <div className="h-full w-24" />
      )}
    </Link>
  );
};

export default Logo;
