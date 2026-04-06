export default async function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-muted min-h-[calc(100vh-4rem)] pt-3">
      <div className="w-0 md:w-1/3"></div>
      <div className="w-full md:w-1/3">{children}</div>
      <div className="w-0 md:w-1/3"></div>
    </div>
  );
}
