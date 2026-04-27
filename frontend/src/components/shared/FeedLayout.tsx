import { Suspense } from "react";
import { TrendingSkeleton } from "../skeletons/trending-skeleton";
import TrendingSidebar from "../post/trending-posts";
import ProfileCard from "../home/profile-card";

export default async function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-muted min-h-[calc(100vh-4rem)] pt-3 lg:px-10">
      <div className="hidden md:block md:w-1/3 px-4">
        <ProfileCard />
      </div>
      <div className="w-full md:w-1/3 px-2">{children}</div>
      <div className="hidden md:block md:w-1/3 px-4">
        <Suspense fallback={<TrendingSkeleton />}>
          <TrendingSidebar />
        </Suspense>
      </div>
    </div>
  );
}
