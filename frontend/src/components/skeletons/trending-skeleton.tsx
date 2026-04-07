export const TrendingSkeleton = () => (
  <div className="sticky top-[150px] left-1/2 translate-x-1/2 space-y-4 w-[300px] p-2 rounded-md">
    <div className="h-3 bg-muted-foreground/20 rounded w-20 animate-pulse" />
    {/* <div className="w-14 h-14 bg-muted-foreground/10 rounded-md shrink-0" /> */}
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex gap-2 animate-pulse p-2">
        <div className="w-12 h-12 bg-muted-foreground/10 rounded-md shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-2 bg-muted-foreground/10 rounded w-20" />
          <div className="h-3 bg-muted-foreground/20 rounded w-full" />
          <div className="h-3 bg-muted-foreground/20 rounded w-2/3" />
        </div>
      </div>
    ))}
  </div>
);
