import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const noteSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(1, "内容は必須です"),
})

//GET /api/notes メモ一覧取得
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json(
      { error: 'メモの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST /api/notes -メモ作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = noteSchema.parse(body);

    const note = await prisma.note.create({
      data: validatedData,
    })
    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "バリデーションエラー", details: error.message },
        { status: 400 }
      );
    }
    console.error("Failed to create note:", error);
    return NextResponse.json(
      { error: "メモの作成に失敗しました" },
      { status: 500 }

    )
  }
}
