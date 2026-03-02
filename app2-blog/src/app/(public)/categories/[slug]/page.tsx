import { PostCard } from "@/components/post-card";
import { PostResponse } from "@/types/post";
import { Pagination } from "@/components/pagination";
import Link from "next/link";
import type { CategoryWithCount } from "@/types/category"
import { get } from "http";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string }>
}


export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params
  const { page } = await searchParams
  //カテゴリの取得
  const categoryRes = await fetch(`http://localhost:3000/api/categories/${slug}`)
  const category = (await categoryRes.json()) as CategoryWithCount;
  const getParams = new URLSearchParams();
  getParams.set("published", "true")
  getParams.set("page", page ?? "1")
  if (slug) getParams.set("categoryId", slug)
  //投稿の取得
  const postRes = await fetch(`http://localhost:3000/api/posts?${getParams}`);
  const { posts, pagination } = (await postRes.json()) as PostResponse

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">すべての記事</Link>
        <span className="text-sm text-muted-foreground">/</span>
        <span className="text-sm text-muted-foreground">{category.name}</span>
      </div>
      <div>
        <h1 className="text-3xl font-bold mt-4">{category.name}</h1>
        <p className="text-muted-foreground mt-2">{category.description}</p>
        <p className="text-sm text-muted-foreground mt-1">{category._count.posts}件の記事</p>
      </div>
      <Separator className="my-8" />
      <div className="flex gap-8">
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} title={post.title} slug={post.slug} excerpt={post.excerpt} categoryName={post.category.name} publishedAt={post.publishedAt} />
            ))}
          </div>
          <Pagination pagination={pagination} basePath={`/categories/${slug}`} />
        </main>
      </div>
    </div >
  );
}
