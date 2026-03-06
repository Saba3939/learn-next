import { Pagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { PostResponse } from "@/types/post";
import { PlusIcon } from "lucide-react";
import { DeletePostButton } from "@/components/delete-button";

type Props = Promise<{
  page?: string;
  categoryId?: string;
}>
export default async function Page({ searchParams }: { searchParams: Props }) {
  const { page } = await searchParams;
  const params = new URLSearchParams();
  params.set("page", page ?? "1")
  //投稿の取得
  const postRes = await fetch(`http://localhost:3000/api/posts?${params}`);
  const { posts, pagination } = (await postRes.json()) as PostResponse

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">記事管理</h1>
        <Button><PlusIcon />新規記事作成</Button>
      </div>
      <Table >
        <TableHeader>
          <TableRow>
            <TableHead className="flex-1">タイトル</TableHead>
            <TableHead className="w-30">カテゴリー</TableHead>
            <TableHead className="w-20">状態</TableHead>
            <TableHead className="w-30">作成日</TableHead>
            <TableHead className="w-30">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.category.name}</TableCell>
              <TableCell>{post.published ?
                <Badge className="bg-green-500">公開</Badge>
                :
                <Badge className="bg-gray-500">下書き</Badge>
              }</TableCell>
              <TableCell>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" className="mr-2" asChild>
                  <Link href={`/admin/posts/edit/${post.id}`}>
                    編集
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      削除
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>記事を削除しますか?</AlertDialogTitle>
                      <AlertDialogDescription>
                        「{post.title}」を削除します。この操作は元に戻せません
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <DeletePostButton postId={post.id} />
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination pagination={pagination} basePath="/admin/posts" />
    </div>
  )
}
