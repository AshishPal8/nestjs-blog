import FeedLayout from "../components/shared/FeedLayout";

export default function Loading() {
  return (
    <FeedLayout>
      <div className="divide-y border-t bg-card">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 space-y-4 animate-pulse">
            {/* Avatar & Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-24" />
                  <div className="h-2 bg-muted/60 rounded w-16" />
                </div>
              </div>
              <div className="w-5 h-5 bg-muted/60 rounded-full" />
            </div>

            {/* Title */}
            <div className="h-5 bg-muted rounded w-3/4" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>

            {/* Image */}
            <div className="flex gap-2 overflow-hidden">
              <div className="h-[300px] w-[80%] shrink-0 bg-muted rounded-lg" />
              <div className="h-[300px] w-[80%] shrink-0 bg-muted/60 rounded-lg" />
            </div>

            {/* Social Actions */}
            <div className="flex items-center gap-6 pt-2">
              <div className="h-4 bg-muted/60 rounded w-12" />
              <div className="h-4 bg-muted/60 rounded w-12" />
              <div className="h-4 bg-muted/60 rounded w-12" />
            </div>
          </div>
        ))}
      </div>
    </FeedLayout>
  );
}
