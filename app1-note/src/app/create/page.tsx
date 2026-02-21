'use client'
import { useState } from "react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "メモの作成に失敗しました")
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "予期せないエラーが発生しました")
    } finally {
      setLoading(false)
      toast.success("作成しました")
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">新規メモ作成</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
            <Input type="text" id="title" name="title" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500" placeholder="メモのタイトルを入力" />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font medium text-gray-700 mb-2">内容</label>
            <Textarea id="content" name="content" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500" placeholder="メモの内容を入力" />
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>{loading ? "作成中..." : "作成する"}</Button>
            <Button onClick={() => router.push("/")} >キャンセル</Button>
          </div>
        </form>
      </div>
    </main>
  )
}

