export const CommentsSkeleton = () => (
  <div className="px-4 pb-10 mt-2">
    <div className="h-4 bg-gray-100 rounded w-24 mb-4 animate-pulse" />
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-24" />
            <div className="h-3 bg-gray-100 rounded w-48" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
