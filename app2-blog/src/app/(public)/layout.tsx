export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">TK BLOG</h1>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
