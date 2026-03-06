import CategoryStrip from "@/src/components/home/category-strip";
import Header from "@/src/components/layout/header";
import { GET_ACTIVE_CATEGORIES } from "@/src/graphql/queries/categories";
import { query } from "@/src/lib/apollo-server-client";
import { ActiveCategoriesData } from "@/src/types/category.types";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await query<ActiveCategoriesData>({
    query: GET_ACTIVE_CATEGORIES,
  });

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white">
        <Header />
        <CategoryStrip categories={data?.activeCategories ?? []} />
      </header>
      {children}
    </main>
  );
}
