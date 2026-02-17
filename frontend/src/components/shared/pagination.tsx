"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
  onChange?: (newPage: number) => void;
};

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };

  const onPrev = () => {
    if (currentPage <= 1) return;
    updatePage(currentPage - 1);
  };

  const onNext = () => {
    if (currentPage >= totalPages) return;
    updatePage(currentPage + 1);
  };

  return (
    <div className={`flex items-center justify-between gap-2`}>
      <Button
        size="sm"
        variant="outline"
        onClick={onPrev}
        disabled={currentPage <= 1}
      >
        Prev
      </Button>

      <div className="px-3 py-1 rounded-md bg-muted/30 text-sm">
        Page <strong className="mx-1">{currentPage}</strong> / {totalPages}
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={onNext}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}
