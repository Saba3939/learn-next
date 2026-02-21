import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { CategoryInput } from "@/lib/validation";

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
