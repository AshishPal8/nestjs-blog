import { Suspense } from "react";
import { TrendingSkeleton } from "../skeletons/trending-skeleton";
import TrendingSidebar from "../post/trending-posts";

export default async function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-muted min-h-[calc(100vh-4rem)] pt-3">
      <div className="hidden md:block md:w-1/3"></div>
      <div className="w-full md:w-1/3">{children}</div>
      <div className="hidden md:block md:w-1/3 ">
        <Suspense fallback={<TrendingSkeleton />}>
          <TrendingSidebar />
        </Suspense>
      </div>
    </div>
  );
}
