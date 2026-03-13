import FeedLayout from "@/src/components/shared/FeedLayout";

export default function PostLoading() {
  return (
    <FeedLayout>
      <div className="divide-y border-t">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 space-y-4 animate-pulse">
            {/* 1. Header: Avatar & Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-24" />
                  <div className="h-2 bg-gray-100 rounded w-16" />
                </div>
              </div>
              <div className="w-5 h-5 bg-gray-100 rounded-full" />
            </div>

            {/* 2. Title */}
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />

            {/* 3. Description (Multiple Lines) */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>

            {/* 4. Image Gallery Skeleton */}
            <div className="flex gap-2 overflow-hidden">
              <div className="h-[300px] w-[80%] shrink-0 bg-gray-200 rounded-lg" />
              <div className="h-[300px] w-[80%] shrink-0 bg-gray-100 rounded-lg" />
            </div>

            {/* 5. Social Actions (Like, Comment, Share) */}
            <div className="flex items-center gap-6 pt-2">
              <div className="h-4 bg-gray-100 rounded w-12" />
              <div className="h-4 bg-gray-100 rounded w-12" />
              <div className="h-4 bg-gray-100 rounded w-12" />
            </div>
          </div>
        ))}
      </div>
    </FeedLayout>
  );
}
