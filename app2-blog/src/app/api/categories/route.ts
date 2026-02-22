import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma/client"
import z from "zod";
import { categorySchema } from "@/lib/validation";

// api/categories GET 全てのカテゴリーの取得
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch category", error)
    return NextResponse.json(
      { message: "カテゴリの取得に失敗しました" },
      { status: 500 }
    )
  }
}

// api/categories POST カテゴリの作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationData = categorySchema.parse(body)

    const category = await prisma.category.create({
      data: validationData,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "バリデーションエラー", details: error.message }, { status: 400 })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "同じ名前またはスラッグのカテゴリが存在します" }, { status: 409 })
    }
    console.error("Failed to create category", error);
    return NextResponse.json({ message: "カテゴリの作成に失敗しました" }, { status: 500 })
  }
}
