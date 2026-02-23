import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

type Props = {
  params: Promise<{ slug: string }>
}
// api/posts/by-slug/[slug] GET スラッグによる投稿の取得
export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params
    const post = await prisma.post.findUnique({
      where: { slug, published: true },
      include: { category: true }
    })
    if (!post) {
      return NextResponse.json({ message: "投稿が見つかりませんでした" }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    console.error("Failed to fetch posts", error);
    return NextResponse.json({ message: "投稿の取得に失敗しました" }, { status: 500 })
  }
}
