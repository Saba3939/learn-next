import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, { message: "カテゴリ名は1文字以上で入力してください" }),
  slug: z.string().min(1, { message: "スラッグ名は必須です" }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "スラッグ名は小文字英数字とハイフンのみ使用できます" }),
  description: z.string().optional()
});

export const postSchema = z.object({
  title: z.string().min(1, { message: "記事のタイトルは必須です" }),
  slug: z.string().min(1, { message: "スラッグ名は必須です" }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "スラッグ名は小文字英数字とハイフンのみ使用できます" }),
  excerpt: z.string().max(200, { message: "要約は200文字以内で入力してください" }).optional(),
  content: z.string().min(1, { message: "本文は1文字以上で入力してください" }),
  published: z.boolean(),
  categoryId: z.cuid()
})
