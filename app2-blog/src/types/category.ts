// src/types/category.ts
import { Prisma } from "@/generated/prisma/client";

export type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: { _count: { select: { posts: true } } };
}>;

// APIレスポンスはこの配列がそのまま返ってくる
export type CategoriesResponse = CategoryWithCount[];
