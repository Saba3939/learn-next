"use client"
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button'
import Link from "next/link";
import toast from "react-hot-toast"

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes")
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    } finally {
      setLoading(false);
    }
  }
  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか?")) return;
    try {
      await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error)
    } finally {
      toast.success("削除しました")
    }
  }
  if (loading) {
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <p className="text-center text-gray-500">読み込み中...</p>
      </div>
    </main>
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className='mb-8'>
          <h1 className='ext-3xl font-bold text-gray-900'>メモアプリ</h1>
          <p className="mt-2 text-gray-600">シンプルなメモ管理アプリ</p>
        </div>
        <Button className="mb-6 w-full">
          <Link href="/create">+新規メモ作成</Link>
        </Button>
        <div className="space-y-4">
          {notes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              メモがありません。新規作成してみましょう
            </p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{note.title}</h2>
                <p className="flex items-center justify-between text-sm text-gray-500">
                  {note.content.substring(0, 100)}
                  {note.content.length > 100 ? "..." : ""}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <span>作成:{new Date(note.createdAt).toLocaleDateString("ja-JP")}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button>
                      <Link href={`/edit/${note.id}`}>
                        編集
                      </Link>
                    </Button>
                    <Button onClick={() => handleDelete(note.id)}>
                      削除
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )
          }
        </div>
      </div>
    </main>
  )
}
