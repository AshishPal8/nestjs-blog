import CategoryStrip from "@/src/components/home/category-strip";
import Header from "@/src/components/layout/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <Header />
      <CategoryStrip />
      {children}
    </main>
  );
}
