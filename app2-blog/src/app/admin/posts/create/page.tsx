"use client"
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Form, FormField, FormControl, FormLabel, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema } from "@/lib/validation"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
import { useEffect, useState } from "react";

type PostFormValues = z.infer<typeof postSchema>  // スキーマから型を自動生成
export default function Page() {
  const router = useRouter();
  const [categories, setCategories] = useState([])

  const onSubmit = async (values: PostFormValues) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    if (res.ok) router.push("/admin/posts")
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")       // スペースをハイフンに
      .replace(/[^a-z0-9-]/g, "") // 英数字とハイフン以外を削除
      .replace(/-+/g, "-")        // 連続するハイフンを1つに
      .replace(/^-|-$/g, "")      // 先頭・末尾のハイフンを削除
  }
  //カテゴリを取得する
  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(data => setCategories(data))
  }, [])

  //フォームバリデーション
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),  // バリデーションをZodに委譲
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      published: false,
    },
  })

  const titleValue = form.watch("title")

  useEffect(() => {
    const slug = generateSlug(titleValue)
    form.setValue("slug", slug)
  }, [titleValue])

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <Link href="/admin/posts" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-8">← 記事一覧に戻る</Link>
      <h1 className="text-2xl font-bold">新規記事作成</h1>
      <Separator className="my-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>タイトル</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>スラッグ</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>カテゴリー</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>抜粋</FormLabel>
                <FormControl>
                  <Textarea  {...field} rows={3} />
                </FormControl>
                <div className="text-sm text-muted-foreground text-right">
                  {field.value?.length ?? 0} / 200
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>本文</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={10} className="min-h-50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem>
                <FormLabel>公開設定</FormLabel>
                <FormControl>
                  <div className="flex">
                    <Label>下書き</Label>
                    <Switch onCheckedChange={field.onChange} checked={field.value} />
                    <Label>公開</Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
        <Separator className="mt-6" />
        <div className="flex justify-end gap-3 pt-6">
          <Button variant="outline">キャンセル</Button>
          <Button >記事を保存する</Button>
        </div>
      </Form>
    </div>
  )
}
