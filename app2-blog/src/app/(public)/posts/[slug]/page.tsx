import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown"
import Link from "next/link";
import type { PostResponse, PostWithCategory } from "@/types/post";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
type Props = {
  params: Promise<{ slug: string }>
}
export default async function Page({ params }: Props) {
  const { slug } = await params;

  // slugから記事を取得
  const postReq = await fetch(`http://localhost:3000/api/posts/by-slug/${slug}`)
  const post = (await postReq.json()) as PostWithCategory
  if (!postReq.ok) {
    notFound()
  }

  const relatedReq = await fetch(`http://localhost:3000/api/posts?limit=3&published=true&categoryId=${post.categoryId}`)
  const { posts } = (await relatedReq.json()) as PostResponse;

  return (
    <div>
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-8">← 記事一覧に戻る</Link>
      <main>
        <Badge>{post.category.name}</Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mt-3">{post.title}</h1>
        <span className="text-sm text-muted-foreground flex items-center gap-1.5 mt-3">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("ja-JP") : "未公開"}</span>
        <Separator className="my-8" />
        <div className="max-w-3xl mx-auto prose">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        <Separator className="my-8" />
        <div>
          <span className="text-xl font-semibold">関連記事</span>
          <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} title={post.title} slug={post.slug} excerpt={post.excerpt} categoryName={post.category.name} publishedAt={post.publishedAt} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
