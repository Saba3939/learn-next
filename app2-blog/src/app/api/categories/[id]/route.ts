import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma/client"
import z from "zod";
import { categorySchema } from "@/lib/validation";
type Props = {
  params: Promise<{ id: string }>
}
export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return NextResponse.json({ message: "カテゴリーが見つかりません" }, { status: 404 })
    }
    return NextResponse.json(category)
  } catch (error) {
    console.error("Failed to fetch category", error);
    return NextResponse.json({ message: "カテゴリの取得に失敗しました" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json()
    const validationData = categorySchema.parse(body)
    const category = await prisma.category.update({
      where: { id },
      data: validationData
    })

    return NextResponse.json(category, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "バリデーションエラー" },
        { status: 400 }
      )
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "カテゴリーが存在しません" }, { status: 404 })
    }
    console.error("Failed to create category", error);
    return NextResponse.json({ message: "カテゴリの更新に失敗しました" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ message: "カテゴリを削除しました" })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "カテゴリーが存在しません" }, { status: 404 })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return NextResponse.json({ message: "投稿が存在するカテゴリは削除できません" }, { status: 409 })
    }
    console.error("Failed to delete category", error);
    return NextResponse.json({ message: "カテゴリの削除に失敗しました" }, { status: 500 })
  }
}
