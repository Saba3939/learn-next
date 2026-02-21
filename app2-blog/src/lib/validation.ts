import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1, { message: "カテゴリ名は1文字以上で入力してください" }),
  slug: z.string().min(1, { message: "スラッグ名は必須です" }).regex(/^[a-z0-9-]+$/, { message: "スラッグ名は小文字英数字とハイフンのみ使用できます" }),
  description: z.string().optional()
});

export type CategoryInput = z.infer<typeof categorySchema>;
