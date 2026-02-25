import { PostCard } from "@/components/post-card";
import { PostResponse } from "@/types/post";
import { Pagination } from "@/components/pagination";
import Link from "next/link";
import type { CategoriesResponse } from "@/types/category"

type Props = Promise<{
  page?: string;
  categoryId?: string;
}>
export default async function Home({ searchParams }: { searchParams: Props }) {
  const { page, categoryId } = await searchParams;
  const params = new URLSearchParams();
  params.set("published", "true")
  params.set("page", page ?? "1")
  if (categoryId) params.set("categoryId", categoryId)
  //投稿の取得
  const postRes = await fetch(`http://localhost:3000/api/posts?${params}`);
  const { posts, pagination } = (await postRes.json()) as PostResponse

  //カテゴリの取得
  const categoryRes = await fetch(`http://localhost:3000/api/categories`)
  const categories = (await categoryRes.json()) as CategoriesResponse;
  return (
    <div>
      <div className="flex gap-8">
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} title={post.title} slug={post.slug} excerpt={post.excerpt} categoryName={post.category.name} publishedAt={post.publishedAt} />
            ))}
          </div>
          <Pagination pagination={pagination} categoryId={categoryId} />
        </main>
        <aside className="w-48 shrink-0">
          <h2 className="font-semibold mb-4">カテゴリ</h2>
          <ul>
            <li>
              <Link href="/">全て</Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/?categoryId=${category.id}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div >
  );
}
