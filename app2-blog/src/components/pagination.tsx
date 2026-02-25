import Link from "next/link"
import { Button } from "./ui/button"
type PaginationProp = {
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
  categoryId?: string
}
export const Pagination = ({ pagination, categoryId }: PaginationProp) => {
  return (
    <div className="flex gap-2 justify-center mt-8">
      {pagination.page <= 1 ?
        <Button disabled>←</Button>
        :
        <Link
          href={categoryId ? `/?page=${pagination.page - 1}&categoryId=${categoryId}` : `/?page=${pagination.page - 1}`}
        >
          <Button >←</Button>
        </Link>
      }
      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
        <Link key={p} href={categoryId ? `/?page=${p}&categoryId=${categoryId}` : `/?page=${p}`}><Button>{p}</Button></Link>
      ))
      }
      {pagination.page >= pagination.totalPages ?
        <Button disabled>→</Button>
        :
        <Link
          href={categoryId ? `/?page=${pagination.page - 1}&categoryId=${categoryId}` : `/?page=${pagination.page + 1}`}
        >
          <Button>→</Button>
        </Link>
      }
    </div >
  )
}

