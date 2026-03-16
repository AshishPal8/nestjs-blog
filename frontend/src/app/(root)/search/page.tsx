import { Suspense } from "react";
import SearchPageClient from "./components/SearchPageClient";
import FeedLayout from "@/src/components/shared/FeedLayout";

interface SearchPageProps {
  searchParams: Promise<{ category?: string; searchterm?: string }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { category, searchterm } = await searchParams;

  return (
    <FeedLayout>
      <Suspense fallback={<SearchSkeleton />}>
        <SearchPageClient categorySlug={category} searchTerm={searchterm} />
      </Suspense>
    </FeedLayout>
  );
};

const SearchSkeleton = () => (
  <div className="divide-y animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100" />
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
      </div>
    ))}
  </div>
);

export default SearchPage;
