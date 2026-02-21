import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const noteSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(1, "内容は必須です"),
})

type Props = {
  params: Promise<{ id: string }>
}

//GET /api/notes 個別メモ取得
export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const note = await prisma.note.findUnique({
      where: { id },
    })

    if (!note) {
      return NextResponse.json(
        { error: "メモが見つかりません" },
        { status: 404 }
      );
    }
    return NextResponse.json(note);
  } catch (error) {
    console.error("Failed to fetch note:", error);
    return NextResponse.json(
      { error: "メモの取得に失敗しました" },
      { status: 500 }
    )
  }
}

// POST /api/notes/[id] -メモ更新
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validateData = noteSchema.parse(body);

    const note = await prisma.note.update({
      where: { id },
      data: validateData,
    })

    return NextResponse.json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "バリデーショエラー", details: error.message },
        { status: 500 }
      )
    }

    console.error("Failed to update note:", error);
    return NextResponse.json(
      { error: "メモの更新に失敗しました" },
      { status: 500 },
    )
  }
}

// DELETE /api/notes/[id] -メモ削除
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.note.delete({
      where: { id },
    })

    return NextResponse.json({ message: "削除しました" })
  } catch (error) {
    console.error("Failed to delete note:", error);
    return NextResponse.json(
      { error: "メモの削除に失敗しました" },
      { status: 500 }
    )
  }
}
