import { PostCard } from "@/components/post-card";
const mockData = [
  {
    id: "1",
    title: "Next.jsのApp Routerを学ぶ",
    slug: "learning-nextjs-app-router",
    excerpt: "App RouterとPages Routerの違いを解説します。",
    categoryName: "技術",
    publishedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Prismaでデータベースを操作する",
    slug: "prisma-database",
    excerpt: "PrismaのORMとしての使い方を紹介します。",
    categoryName: "技術",
    publishedAt: "2024-01-20",
  },
  {
    id: "3",
    title: "Tailwind CSSのすすめ",
    slug: "tailwind-css-guide",
    excerpt: "ユーティリティファーストの考え方を解説します。",
    categoryName: "デザイン",
    publishedAt: "2024-01-25",
  },
];
export default function Home() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">TK BLOG</h1>
      <div className="flex gap-8">
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockData.map((post) => (
              <PostCard key={post.id} title={post.title} slug={post.slug} excerpt={post.excerpt} categoryName={post.categoryName} publishedAt={post.publishedAt} />
            ))}
          </div>
        </main>
        <aside className="w-48 shrink-0">
          <h2 className="font-semibold mb-4">カテゴリ</h2>
          <ul>
            <li>全て</li>
            <li>技術</li>
            <li>デザイン</li>
          </ul>

        </aside>
      </div>
    </div>
  );
}
