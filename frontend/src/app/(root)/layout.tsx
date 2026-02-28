import CategoryStrip from "@/src/components/home/category-strip";
import Header from "@/src/components/layout/header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <Header />
      <CategoryStrip />
      <div className="flex">
        <div className="w-1/3 bg-gray-200"></div>
        <div className="w-1/3">{children}</div>
        <div className="w-1/3 bg-gray-200"></div>
      </div>
    </main>
  );
}
