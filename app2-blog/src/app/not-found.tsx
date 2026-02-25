import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">記事が見つかりません</p>
        <Button className="mt-3" asChild>
          <Link href="/">記事一覧に戻る</Link>
        </Button>
      </div>
    </div>
  )
}
