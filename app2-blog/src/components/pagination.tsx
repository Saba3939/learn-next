import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | "...")[] = []

  pages.push(1)

  if (current > 3) pages.push("...")

  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p)
  }

  if (current < total - 2) pages.push("...")

  pages.push(total)

  return pages
}

export const Pagination = ({ pagination, categoryId }: PaginationProp) => {
  const pageNumbers = getPageNumbers(pagination.page, pagination.totalPages)
  return (
    <div className="flex gap-2 justify-center mt-8">
      {pagination.page <= 1 ?
        <Button disabled variant="ghost"><ChevronLeft /></Button>
        :
        <Link
          href={categoryId ? `/?page=${pagination.page - 1}&categoryId=${categoryId}` : `/?page=${pagination.page - 1}`}
        >
          <Button variant="ghost"><ChevronLeft /></Button>
        </Link>
      }
      {pageNumbers.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 flex items-center text-muted-foreground">...</span>
        ) : (
          <Link key={p} href={categoryId ? `/?page=${p}&categoryId=${categoryId}` : `/?page=${p}`}>
            <Button variant={pagination.page === p ? "default" : "outline"}>{p}</Button>
          </Link>
        )
      )}
      {pagination.page >= pagination.totalPages ?
        <Button disabled variant="ghost"><ChevronRight /></Button>
        :
        <Link
          href={categoryId ? `/?page=${pagination.page - 1}&categoryId=${categoryId}` : `/?page=${pagination.page + 1}`}
        >
          <Button variant="ghost"><ChevronRight /></Button>
        </Link>
      }
    </div >
  )
}

