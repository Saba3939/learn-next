# アプリ1: シンプルメモアプリ - 開発ガイド

## 🎯 このガイドの目的

このガイドでは、メモアプリを**ステップバイステップ**で実装していきます。
各ステップは独立しており、1つずつ確実に進めることで、着実にスキルを身につけられます。

---

## 📋 開発の流れ

```
1. 環境構築 (30分)
   ↓
2. プロジェクト初期化 (30分)
   ↓
3. データベースセットアップ (30分)
   ↓
4. API Routesの作成 (1-2時間)
   ↓
5. メモ一覧表示 (1-2時間)
   ↓
6. メモ作成機能 (1-2時間)
   ↓
7. メモ編集機能 (1-2時間)
   ↓
8. メモ削除機能 (30分-1時間)
   ↓
9. スタイリング改善 (1-2時間)
   ↓
10. 最終調整・テスト (1時間)
```

**合計見込み時間**: 8-12時間（初学者ペース）

---

## ステップ1: 環境構築

### 1-1. PostgreSQLをDockerで起動

```bash
# PostgreSQLコンテナを起動
docker run --name postgres-learn \\
  -e POSTGRES_PASSWORD=password \\
  -e POSTGRES_DB=learndb \\
  -p 5432:5432 \\
  -d postgres:16

# 起動確認
docker ps
```

**確認ポイント**: `docker ps`で`postgres-learn`が表示されること

---

## ステップ2: Next.jsプロジェクト作成

### 2-1. プロジェクトを作成

```bash
# app1-noteディレクトリに移動
cd /Users/kento/Programs/webapp/learn/app1-note
# Next.jsプロジェクトを作成（ディレクトリ内に直接作成）
npx create-next-app@latest . --typescript --tailwind --app --src-dir
```

**設定の選択**:
- ✅ Would you like to use TypeScript? Yes
- ✅ Would you like to use ESLint? Yes  
- ✅ Would you like to use Tailwind CSS? Yes
- ✅ Would you like to use `src/` directory? Yes
- ✅ Would you like to use App Router? Yes
- ❌ Would you like to customize the default import alias? No

### 2-2. 開発サーバーを起動してみる

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開き、Next.jsのデフォルトページが表示されることを確認。

**確認できたらCtrl+Cで停止**

---

## ステップ3: Prismaのセットアップ

### 3-1. Prismaをインストール

```bash
npm install prisma @prisma/client zod
```

### 3-2. Prismaを初期化

```bash
npx prisma init
```

これで以下が作成される：
- `prisma/schema.prisma`
- `.env`

### 3-3. 環境変数を設定

`.env`ファイルを編集：

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/learndb?schema=public"
```

### 3-4. スキーマを定義

`prisma/schema.prisma`を編集：

```prisma
generator client {
  provider = "prisma-client"
}

datasource db {
  provider = "postgresql"
}

model Note {
  id        String   @id @default(uuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Prisma v7の変更点**:
- `provider = "prisma-client"` に変更（v7の新しい設定）
- `datasource`の`url`は`.env`ファイルで自動的に読み込まれます
- `@default(uuid())` を使用（cuidの代わり）

### 3-5. マイグレーションを実行

```bash
npx prisma migrate dev --name init
```

成功すると：
- データベースに`Note`テーブルが作成される
- `prisma/migrations/`フォルダが作成される

### 3-6. Prisma Studioで確認

```bash
npx prisma studio
```

ブラウザが開き、データベースをGUIで確認できる。

---

## ステップ4: Prismaクライアントの設定

### 4-1. libディレクトリとPrismaクライアントファイルを作成

```bash
mkdir -p src/lib
```

`src/lib/prisma.ts`を作成：

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## ステップ5: API Routesの作成

### 5-1. API Routesディレクトリを作成

```bash
mkdir -p src/app/api/notes/[id]
```

### 5-2. メモ一覧取得・作成APIを作成

`src/app/api/notes/route.ts`を作成：

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// バリデーションスキーマ
const noteSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  content: z.string().min(1, '内容は必須です'),
});

// GET /api/notes - メモ一覧取得
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return NextResponse.json(
      { error: 'メモの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// POST /api/notes - メモ作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    const validatedData = noteSchema.parse(body);
    
    const note = await prisma.note.create({
      data: validatedData,
    });
    
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Failed to create note:', error);
    return NextResponse.json(
      { error: 'メモの作成に失敗しました' },
      { status: 500 }
    );
  }
}
```

### 5-3. 個別メモ取得・更新・削除APIを作成

`src/app/api/notes/[id]/route.ts`を作成：

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const noteSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  content: z.string().min(1, '内容は必須です'),
});

type Props = {
  params: {
    id: string;
  };
};

// GET /api/notes/[id] - 個別メモ取得
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const note = await prisma.note.findUnique({
      where: { id: params.id },
    });

    if (!note) {
      return NextResponse.json(
        { error: 'メモが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Failed to fetch note:', error);
    return NextResponse.json(
      { error: 'メモの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// PUT /api/notes/[id] - メモ更新
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const body = await request.json();
    const validatedData = noteSchema.parse(body);

    const note = await prisma.note.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to update note:', error);
    return NextResponse.json(
      { error: 'メモの更新に失敗しました' },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - メモ削除
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await prisma.note.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: '削除しました' });
  } catch (error) {
    console.error('Failed to delete note:', error);
    return NextResponse.json(
      { error: 'メモの削除に失敗しました' },
      { status: 500 }
    );
  }
}
```

### 5-4. APIの動作確認

開発サーバーを起動：

```bash
npm run dev
```

ブラウザまたはcurlでAPIをテスト：

```bash
# メモ一覧取得
curl http://localhost:3000/api/notes

# メモ作成
curl -X POST http://localhost:3000/api/notes \\
  -H "Content-Type: application/json" \\
  -d '{"title":"テストメモ","content":"これはテストです"}'
```

---

## ステップ6: メモ一覧表示を実装

### 6-1. ルートページを編集

`src/app/page.tsx`を以下に置き換え：

```typescript
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      await fetch(\`/api/notes/\${id}\`, {
        method: 'DELETE',
      });
      fetchNotes(); // リロード
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <p className="text-center text-gray-500">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📝 メモアプリ</h1>
          <p className="mt-2 text-gray-600">シンプルなメモ管理アプリ</p>
        </div>

        <Link
          href="/create"
          className="mb-6 block rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
        >
          + 新規メモ作成
        </Link>

        <div className="space-y-4">
          {notes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              メモがありません。新規作成してみましょう！
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {note.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {note.content.substring(0, 100)}
                  {note.content.length > 100 ? '...' : ''}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <span>作成: {new Date(note.createdAt).toLocaleDateString('ja-JP')}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={\`/edit/\${note.id}\`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️ 編集
                    </Link>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️ 削除
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
```

### 6-2. 動作確認

```bash
npm run dev
```

http://localhost:3000 を開くと、メモ一覧が表示されます（まだ空）。

---

## ステップ7: メモ作成機能を実装

## ステップ7: メモ作成機能を実装

### 7-1. 作成ページを作成

```bash
mkdir -p src/app/create
```

`src/app/create/page.tsx`を作成：

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();
const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'メモの作成に失敗しました');
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
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
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              タイトル
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="メモのタイトルを入力"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              内容
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="メモの内容を入力"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? '作成中...' : '作成する'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
```

### 7-2. 動作確認

1. 「新規メモ作成」ボタンをクリック
2. タイトルと内容を入力
3. 「作成する」ボタンをクリック
4. トップページに戻り、メモが表示される

---

## ステップ8: メモ編集機能を実装

### 8-1. 編集ページを作成

```bash
mkdir -p src/app/edit/[id]
```

`src/app/edit/[id]/page.tsx`を作成：

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function EditPage({ params }: Props) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNote();
  }, []);

  const fetchNote = async () => {
    try {
      const response = await fetch(\`/api/notes/\${params.id}\`);
      if (!response.ok) {
        throw new Error('メモが見つかりません');
      }
      const data = await response.json();
      setNote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    try {
      const response = await fetch(\`/api/notes/\${params.id}\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'メモの更新に失敗しました');
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-2xl px-4">
          <p className="text-center text-gray-500">読み込み中...</p>
        </div>
      </main>
    );
  }

  if (error && !note) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-2xl px-4">
          <p className="text-center text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!note) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">メモを編集</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              タイトル
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={note.title}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              内容
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              defaultValue={note.content}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {submitting ? '更新中...' : '更新する'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
```

---

## ステップ9: 最終確認

### 9-1. TypeScriptのエラーチェック

```bash
npm run build
```

エラーがないことを確認。

### 9-2. 全機能のテスト

- [ ] APIエンドポイントが正しく動作する
- [ ] メモを作成できる
- [ ] 作成したメモが一覧に表示される
- [ ] メモを編集できる
- [ ] 編集内容が反映される
- [ ] メモを削除できる
- [ ] エラーハンドリングが適切に動作する

---

## 🎉 完成！

おめでとうございます！シンプルメモアプリが完成しました。

### 習得したスキル

✅ Next.js App Routerの基礎
✅ Prismaでの基本的なCRUD操作
✅ Next.js API Routesの作成
✅ RESTful APIの設計
✅ フロントエンドからのfetch/API呼び出し
✅ Client ComponentとServer Componentの使い分け
✅ Zodでのバリデーション
✅ エラーハンドリング
✅ Dynamic Routesの実装
✅ Tailwind CSSでのスタイリング

---

## 💡 学んだこと

### API Routes vs Server Actions

#### API Routes（今回実装した方法）
**メリット:**
- RESTful APIの設計が学べる
- フロントエンドとバックエンドの分離
- 他のクライアント（モバイルアプリなど）からも利用可能
- エラーハンドリングが明示的

**デメリット:**
- コード量が増える
- 状態管理が必要
- ローディング状態の管理が必要

#### Server Actions
**メリット:**
- コード量が少ない
- フォームとの統合が簡単
- 自動的なキャッシュ無効化

**デメリット:**
- RESTful APIの学習機会が少ない
- 外部からのアクセスができない
- エラーハンドリングが複雑になりがち

### どちらを使うべきか？

- **学習目的**: API Routesを推奨（Web開発の基礎が学べる）
- **プロトタイプ**: Server Actionsが便利
- **本番アプリ**: 用途に応じて使い分け
  - 外部APIとして公開する場合: API Routes
  - 内部のみで使用: Server Actions

---

## 🚀 次のステップ

次は**アプリ2: シンプルブログ**を作成します！

**準備ができたら、次のアプリに進みましょう！** 🎯
