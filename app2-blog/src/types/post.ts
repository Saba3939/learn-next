import { Prisma } from "@/generated/prisma/client";

export type PostWithCategory = Prisma.PostGetPayload<{
  include: { category: true }
}>

export type PostResponse = {
  posts: PostWithCategory[];
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
}
