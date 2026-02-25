import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { CategoryBadge } from "./category-badge";
import Link from "next/link";

type PostCardProps =
  {
    title: string
    slug: string
    excerpt: string | null
    categoryName: string
    publishedAt: string | null
  }

export const PostCard = ({ title, slug, excerpt, categoryName, publishedAt }: PostCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CategoryBadge name={categoryName} />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{excerpt}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-between">
        <span>{publishedAt ? new Date(publishedAt).toLocaleDateString("ja-JP") : "未公開"}</span>
        <Link href={`/posts/${slug}`}>→続きを読む</Link>
      </CardFooter>
    </Card>
  )
}
