import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma/client";
import { z } from "zod"
import { postSchema } from "@/lib/validation";

// api/posts GET 全ての投稿を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    //ページネーションパラメータ
    const page = Math.max(1, Number(searchParams.get("page") ?? 1))
    const limit = Math.min(100, Number(searchParams.get("limit") ?? 10))
    //フィルタパラメータ
    const published = searchParams.get("published")
    const categoryId = searchParams.get("categoryId")

    const where = {
      ...(published !== null && { published: published === "true" }),
      ...(categoryId !== null && { categoryId })
    }
    //posts: 投稿 totalCount: 投稿数
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.post.count({ where })
    ])
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    })
  } catch (error) {
    console.error("Failed to fetch posts", error);
    return NextResponse.json({ message: "投稿の取得に失敗しました" }, { status: 500 })
  }
}

// api/posts POST 投稿の作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationData = postSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        ...validationData,
        ...(validationData.published && { publishedAt: new Date() })
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "バリデーションエラー", details: error.message }, { status: 400 })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "スラッグの投稿が存在します" }, { status: 409 })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return NextResponse.json({ message: "指定されたカテゴリが存在しません" }, { status: 400 })
    }
    console.error("Failed to create post", error);
    return NextResponse.json({ message: "投稿の作成に失敗しました" }, { status: 500 })
  }
}

