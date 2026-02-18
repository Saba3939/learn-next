# アプリ1: シンプルメモアプリ - 要件定義書

## 📋 プロジェクト概要

### 目的
Next.js、Prisma、TypeScriptの基礎を実践的に学ぶための最初のプロジェクト

### 学習目標
- Next.js App Routerの基礎を理解する
- Prismaでの基本的なCRUD操作を習得する
- API Routesの作成と使い方を学ぶ
- フロントエンドからのAPI呼び出しを習得する
- Tailwind CSSでのスタイリングに慣れる

---

## 🎯 機能要件

### 1. メモ一覧表示
- すべてのメモを一覧表示
- 新しいメモが上に表示される（作成日時の降順）
- 各メモカードには以下を表示：
  - タイトル
  - 内容（最初の100文字程度）
  - 作成日時
  - 更新日時

### 2. メモの作成
- タイトル入力欄（必須）
- 内容入力欄（必須、複数行）
- 作成ボタン
- フォーム送信後、一覧ページに自動遷移
- 作成成功時のフィードバック表示

### 3. メモの編集
- 編集ボタンから編集画面へ遷移
- タイトルと内容を編集可能
- 更新ボタンで保存
- キャンセルボタンで一覧に戻る
- 更新日時を自動更新

### 4. メモの削除
- 削除ボタンをクリック
- 確認なしで即座に削除（シンプルな実装）
- 削除後、一覧を自動更新

---

## 🗄️ データベース設計

### Noteモデル

| フィールド | 型 | 制約 | 説明 |
|-----------|-------|------|------|
| id | String | PK, @default(cuid()) | 一意識別子 |
| title | String | Required | メモのタイトル |
| content | String | Required | メモの本文 |
| createdAt | DateTime | @default(now()) | 作成日時 |
| updatedAt | DateTime | @updatedAt | 更新日時 |

### Prismaスキーマ
```prisma
model Note {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🎨 UI/UX要件

### デザイン方針
- シンプルで直感的
- モバイルファーストのレスポンシブデザイン
- Tailwind CSSのユーティリティクラスを活用

### 画面構成

#### 1. メモ一覧画面（トップページ）
```
┌─────────────────────────────────────┐
│  📝 メモアプリ                       │
│  ┌───────────────────────────────┐  │
│  │ + 新規メモ作成                 │  │
│  └───────────────────────────────┘  │
│                                      │
│  ┌───────────────────────────────┐  │
│  │ メモタイトル1           🗑️ ✏️  │
│  │ メモの内容のプレビュー...       │
│  │ 作成: 2026-02-17 更新: 2026... │
│  └───────────────────────────────┘  │
│                                      │
│  ┌───────────────────────────────┐  │
│  │ メモタイトル2           🗑️ ✏️  │
│  │ メモの内容のプレビュー...       │
│  │ 作成: 2026-02-16 更新: 2026... │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### 2. メモ作成画面
```
┌─────────────────────────────────────┐
│  新規メモ作成                        │
│                                      │
│  タイトル                            │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                      │
│  内容                                │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │                               │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                      │
│  [作成する]  [キャンセル]            │
└─────────────────────────────────────┘
```

### カラースキーム
- プライマリ: Blue (Tailwind blue-600)
- 背景: Gray-50
- カード: White
- テキスト: Gray-900
- ボーダー: Gray-200

---

## 🛠️ 技術要件

### フロントエンド
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**

### バックエンド
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL** (ローカル Docker)
- **Zod** (バリデーション)

### 開発ツール
- **Node.js** 20.x以上
- **npm** または **pnpm**
- **Docker** (PostgreSQL用)

---

## 📁 ディレクトリ構造

```
app1-note/
├── docs/
│   ├── requirements.md          # このファイル
│   └── development-guide.md     # 開発ガイド
├── prisma/
│   └── schema.prisma            # Prismaスキーマ
├── src/
│   ├── app/
│   │   ├── layout.tsx           # ルートレイアウト
│   │   ├── page.tsx             # メモ一覧ページ
│   │   ├── create/
│   │   │   └── page.tsx         # メモ作成ページ
│   │   ├── edit/
│   │   │   └── [id]/
│   │   │       └── page.tsx     # メモ編集ページ
│   │   └── api/
│   │       └── notes/
│   │           ├── route.ts     # GET, POST
│   │           └── [id]/
│   │               └── route.ts # GET, PUT, DELETE
│   └── lib/
│       └── prisma.ts            # Prismaクライアント
├── .env.local                   # 環境変数
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## ✅ 受け入れ基準

### 完了の定義
以下がすべて動作すれば完了：

1. [ ] メモを新規作成できる
2. [ ] 作成したメモが一覧に表示される
3. [ ] メモを編集できる
4. [ ] メモを削除できる
5. [ ] レスポンシブデザインが動作する
6. [ ] エラーが発生しない
7. [ ] TypeScriptのコンパイルエラーがない

---

## 🎓 学習ポイント

### このアプリで身につくスキル

#### 1. Next.js App Router
- ファイルベースルーティング
- Server Components
- Dynamic Routes（[id]）
- layout.tsxの使い方

#### 2. Prisma
- スキーマ定義
- マイグレーション
- CRUD操作（create, findMany, findUnique, update, delete）
- Prisma Clientの使い方

#### 3. API Routes
- Next.js API Routesの作成
- HTTPメソッド（GET, POST, PUT, DELETE）
- NextRequest, NextResponseの使い方
- RESTful APIの設計原則
- エラーハンドリング

#### 4. フロントエンドからのAPI呼び出し
- fetchを使ったデータ取得
- useStateでの状態管理
- Client ComponentとServer Componentの使い分け
- ローディング状態の管理

#### 5. バリデーション
- Zodスキーマの定義
- リクエストデータの検証
- エラーメッセージのハンドリング

#### 6. TypeScript
- 型定義
- インターフェース
- 型推論

#### 7. Tailwind CSS
- ユーティリティクラス
- レスポンシブデザイン（sm:, md:, lg:）
- カードコンポーネント
- フォームスタイリング

---

## 📚 参考リソース

### 公式ドキュメント
- [Next.js Documentation - App Router](https://nextjs.org/docs/app)
- [Prisma Documentation - Getting Started](https://www.prisma.io/docs/getting-started)
- [Server Actions and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**準備ができたら development-guide.md を参照して実装を始めましょう！** 🚀
