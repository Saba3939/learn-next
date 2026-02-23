import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma/client";
import { z } from "zod"
import { postSchema } from "@/lib/validation";

type Props = {
  params: Promise<{ id: string }>
}
// api/posts[id] GET IDから投稿を取得
export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const post = await prisma.post.findUnique({
      where: { id },
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

// api/posts/[id] PUT 投稿の作成
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const body = await request.json();
    const { id } = await params;
    const validationData = postSchema.parse(body)

    const existingPost = await prisma.post.findUnique({ where: { id } })
    if (!existingPost) {
      return NextResponse.json({ message: "投稿が見つかりません" }, { status: 404 })
    }
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...validationData,
        ...(validationData.published && !existingPost.published && { publishedAt: new Date() })
      }
    })

    return NextResponse.json(post, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "バリデーションエラー", details: error.message }, { status: 400 })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "同じスラッグの投稿が存在します" }, { status: 409 })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return NextResponse.json({ message: "指定されたカテゴリが存在しません" }, { status: 400 })
    }
    console.error("Failed to update post", error);
    return NextResponse.json({ message: "投稿の更新に失敗しました" }, { status: 500 })
  }
}

// api/posts/[id] DELETE 投稿の削除
export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: "投稿を削除しました" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "投稿が存在しません" }, { status: 404 })
    }
    console.error("Failed to delete post", error);
    return NextResponse.json({ message: "投稿の削除に失敗しました" }, { status: 500 })

  }
}

