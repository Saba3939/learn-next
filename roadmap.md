# Next.js フルスタックアプリ開発 ハンズオン学習ロードマップ

## 🎯 学習の目標
簡単なアプリから作り始めて、実践しながら基礎を身につける

## 📋 現状分析
- ✅ Next.jsの基本知識はある
- ✅ HTMLCSSはある程度理解している
- ❌ 実装能力が不足
- ❌ AIに依存しすぎている

## 🚀 学習アプローチ
**理論→実践ではなく、実践→理論で学ぶ**
- 5つのアプリを段階的に作成
- 各アプリで新しいスキルを習得
- 前のアプリの知識を次に活かす

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript** - 型安全性のため必須
- **Tailwind CSS** - スタイリング

### バックエンド
- **Next.js API Routes** - RESTful APIエンドポイント
- **Prisma** - ORMとして
- **PostgreSQL** (ローカル) - 本番はSupabaseへ移行可能
- **Zod** - バリデーション

### 認証・セキュリティ
- **NextAuth.js (Auth.js v5)** - 認証
- **bcrypt** - パスワードハッシュ化

### その他ツール
- **React Hook Form** - フォーム管理
- **SWR  TanStack Query** - データフェッチング
- **dnd-kit** - Drag & Drop
- **date-fns** - 日付操作
- **Lucide React** - アイコン

---

## 📱 アプリ1: シンプルメモアプリ（1週間）

### 🎯 学ぶこと
- Next.js App Routerの基礎
- Prismaでの基本的なCRUD
- API Routesの作成と使い方
- フロントエンドからのAPI呼び出し
- Tailwindでのスタイリング

### 機能
- メモの作成・表示・編集・削除
- シンプルな1画面アプリ
- 認証なし（後で追加）

### データベーススキーマ
\`\`\`prisma
model Note {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
\`\`\`

### 実装ステップ
1. [ ] Next.jsプロジェクト作成
2. [ ] PostgreSQL起動とPrismaセットアップ
3. [ ] スキーマ定義とマイグレーション
4. [ ] API Routesの作成（CRUD操作）
   - GET /api/notes - メモ一覧取得
   - POST /api/notes - メモ作成
   - PUT /api/notes/[id] - メモ更新
   - DELETE /api/notes/[id] - メモ削除
5. [ ] メモ一覧表示（Client Component + API呼び出し）
6. [ ] メモ作成フォーム
7. [ ] メモ編集機能
8. [ ] メモ削除機能
9. [ ] Tailwindでスタイリング

### 習得スキル
✅ プロジェクト初期化
✅ Prismaの基本操作
✅ Next.js API Routesの作成
✅ RESTful APIの設計
✅ フロントエンドからのfetch/API呼び出し
✅ エラーハンドリング

---

## 📝 アプリ2: シンプルブログ（1-2週間）

### 🎯 学ぶこと
- Dynamic Routes
- データベースリレーション
- ページネーション
- Zodバリデーション

### 機能
- 記事一覧・詳細ページ
- カテゴリー機能
- ページネーション
- 管理画面での記事CRUD

### データベーススキーマ
\`\`\`prisma
model Post {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  content     String
  excerpt     String?
  published   Boolean    @default(false)
  category    Category   @relation(fields: [categoryId], references: [id])
  categoryId  String
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Category {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
  posts Post[]
}
\`\`\`

### 実装ステップ
1. [ ] プロジェクト作成とセットアップ
2. [ ] スキーマ定義（リレーション含む）
3. [ ] ブログ記事一覧ページ
4. [ ] 記事詳細ページ（Dynamic Routes）
5. [ ] カテゴリー別フィルタリング
6. [ ] 管理画面：記事CRUD
7. [ ] Zodバリデーション
8. [ ] ページネーション実装

### 習得スキル
✅ Dynamic Routes（[slug]）
✅ Prismaのリレーション（1対多）
✅ includeselectでのデータ取得
✅ Zodバリデーション
✅ ページネーション

---

## 🔐 アプリ3: 認証付きTODOアプリ（2週間）

### 🎯 学ぶこと
- NextAuth.js v5での認証
- ユーザーごとのデータ管理
- ミドルウェアでの認証保護
- React Hook Form
- エラーハンドリング

### 機能
- サインアップログイン
- ユーザーごとのTODOリスト
- TODO作成・完了・削除
- カテゴリー分け
- フィルタリング（完了未完了）

### データベーススキーマ
\`\`\`prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  todos     Todo[]
  createdAt DateTime @default(now())
}

model Todo {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  category    String?
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
\`\`\`

### 実装ステップ
1. [ ] プロジェクト作成
2. [ ] NextAuth.js v5セットアップ
3. [ ] サインアップページ（パスワードハッシュ化）
4. [ ] ログインページ
5. [ ] ミドルウェアで認証保護
6. [ ] TODOのCRUD（ユーザーフィルタリング）
7. [ ] React Hook Formでフォーム管理
8. [ ] エラーハンドリング

### 習得スキル
✅ NextAuth.js v5の基本
✅ Credentials Provider
✅ bcryptでのパスワードハッシュ化
✅ ミドルウェアでのルート保護
✅ ユーザーごとのデータフィルタリング
✅ React Hook Form

---

## 📚 アプリ4: 読書管理アプリ（2-3週間）

### 🎯 学ぶこと
- 複雑なデータリレーション
- 検索機能
- ファイルアップロード
- データのソート・フィルタリング
- ダッシュボードUI

### 機能
- ユーザー認証
- 本の登録（タイトル、著者、カバー画像）
- 読書ステータス（未読・読書中・読了）
- レビュー・評価
- 読書統計ダッシュボード
- 検索・フィルタリング

### データベーススキーマ
\`\`\`prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  books     Book[]
  createdAt DateTime @default(now())
}

model Book {
  id          String     @id @default(cuid())
  title       String
  author      String
  coverUrl    String?
  status      ReadStatus @default(TO_READ)
  rating      Int?       g 1-5
  review      String?
  startedAt   DateTime?
  finishedAt  DateTime?
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum ReadStatus {
  TO_READ
  READING
  FINISHED
}
\`\`\`

### 実装ステップ
1. [ ] プロジェクト作成と認証セットアップ
2. [ ] スキーマ定義
3. [ ] 本の登録フォーム
4. [ ] 画像アップロード
5. [ ] 本の一覧表示（ステータス別）
6. [ ] 詳細ページ・編集・削除
7. [ ] 検索機能（タイトル・著者）
8. [ ] ダッシュボード（統計表示）
9. [ ] フィルタリング・ソート

### 習得スキル
✅ ファイルアップロード
✅ Enumの使い方
✅ 複雑なフィルタリング
✅ 集計データの取得
✅ ダッシュボードUI

---

## 🎯 アプリ5: プロジェクト管理アプリ（3-4週間）

### 🎯 学ぶこと
- 多対多リレーション
- 複雑なビジネスロジック
- リアルタイム更新（SWR）
- Drag & Drop
- 本格的なアプリケーション設計

### 機能
- ユーザー認証
- プロジェクト管理
- タスク管理（カンバンボード）
- タスクへのタグ付け
- 期限・優先度
- ダッシュボード

### データベーススキーマ
\`\`\`prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  password  String
  projects  Project[]
  tasks     Task[]
  createdAt DateTime  @default(now())
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  color       String   @default("#3B82F6")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  tasks       Task[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId   String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  tags        Tag[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  color String @default("#10B981")
  tasks Task[]
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
\`\`\`

### 実装ステップ
1. [ ] プロジェクト作成と認証
2. [ ] スキーマ定義（多対多リレーション）
3. [ ] プロジェクトCRUD
4. [ ] タスクCRUD
5. [ ] カンバンボードUI
6. [ ] Drag & Drop機能（dnd-kit）
7. [ ] タグ管理
8. [ ] フィルタリング・検索
9. [ ] ダッシュボード（統計）
10. [ ] SWRでリアルタイム更新

### 習得スキル
✅ 多対多リレーション
✅ 複雑なデータ構造
✅ Drag & Drop
✅ SWRTanStack Query
✅ 本格的なアプリ設計
✅ パフォーマンス最適化

---

## 🚀 発展：Supabaseへ移行（1-2週間）

### 目標
ローカルPostgreSQLからSupabaseへ移行

### 実装ステップ
1. [ ] Supabaseプロジェクト作成
2. [ ] 接続文字列を更新
3. [ ] マイグレーション実行
4. [ ] Supabase Authへ移行（オプション）
5. [ ] Supabase Storageで画像管理
6. [ ] Vercelへデプロイ

---

## 💡 学習のコツ

### 1. AIとの付き合い方
- **理解してから使う**: AIが生成したコードを盲目的にコピペしない
- **段階的に頼る**: まず自分で考え、詰まったらAIに聞く
- **コードを読み解く**: AIのコードがなぜ動くのか理解する
- **修正練習**: AIのコードを自分で改善してみる

### 2. 効果的な学習法
- **公式ドキュメントを読む**: Next.js、Prisma、TypeScriptの公式ドキュメント
- **小さく始める**: 一度に多くを学ぼうとしない
- **繰り返し練習**: 同じ機能を何度も実装する
- **エラーと向き合う**: エラーメッセージを読み、原因を理解する
- **コードを書く**: 読むだけでなく、実際に手を動かす

### 3. デバッグ力を鍛える
- \`console.log\`でデータを確認
- ブラウザのDevToolsを活用
- エラースタックトレースを読む
- Prisma Studioでデータベースを確認

### 4. 記録を残す
- 学んだことをメモする
- ハマったポイントと解決策を記録
- 自分なりのチートシートを作る

---

## �� 推奨リソース

### 公式ドキュメント
- [Next.js Documentation](https:gnextjs.orggdocs)
- [React Documentation](https:greact.dev)
- [Prisma Documentation](https:gwww.prisma.iogdocs)
- [TypeScript Handbook](https:gwww.typescriptlang.orggdocs/handbook/)
- [Tailwind CSS Documentation](https:gtailwindcss.comgdocs)

### チュートリアル
- [Next.js Learn Course](https:gnextjs.orgglearn)
- [TypeScript for JavaScript Programmers](https:gwww.typescriptlang.orggdocs/handbook/typescript-in-5-minutes.html)

---

## ✅ 成功の指標

### 各アプリ完了の基準
- **アプリ1**: 基本的なCRUDが自力で実装できる
- **アプリ2**: リレーションとルーティングを理解
- **アプリ3**: 認証システムを実装できる
- **アプリ4**: 複雑な機能を設計・実装できる
- **アプリ5**: 実用的なアプリを完成させられる

### 最終目標達成の確認
以下を**AIなしで**できれば目標達成：
- [ ] Next.jsプロジェクトを0から立ち上げられる
- [ ] データベーススキーマを設計できる
- [ ] 認証システムを実装できる
- [ ] CRUDオペレーションを実装できる
- [ ] フォームとバリデーションを実装できる
- [ ] エラーをデバッグできる
- [ ] レスポンシブなUIを作成できる

---

## 📅 推奨学習スケジュール

| アプリ | 期間 | 学習時間の目安 | 累計 |
|-------|------|----------------|------|
| アプリ1: メモアプリ | 1週間 | 週10-15時間 | 1週 |
| アプリ2: ブログ | 1-2週間 | 週10-15時間 | 3週 |
| アプリ3: TODO | 2週間 | 週12-15時間 | 5週 |
| アプリ4: 読書管理 | 2-3週間 | 週12-18時間 | 8週 |
| アプリ5: プロジェクト管理 | 3-4週間 | 週15-20時間 | 12週 |
| Supabase移行 | 1-2週間 | 週8-12時間 | 14週 |

**合計**: 約3-3.5ヶ月で基礎から実践まで（週10-18時間の学習を想定）

---

## 🚦 次のステップ

**アプリ1から始めましょう！**

### ステップ1: 環境準備
```bash
# PostgreSQL起動
docker run --name postgres-learn \\
  -e POSTGRES_PASSWORD=password \\
  -e POSTGRES_DB=learndb \\
  -p 5432:5432 \\
  -d postgres:16

# Next.jsプロジェクト作成
npx create-next-app@latest note-app
# ✅ TypeScript
# ✅ Tailwind CSS
# ✅ App Router
# ✅ Use `src` directory
```

### ステップ2: Prismaセットアップ
```bash
cd note-app
npm install prisma @prismaclient
npx prisma init
```

### ステップ3: 実装開始
アプリ1の実装ステップに従って進めていきましょう！

**準備ができたら教えてください。一緒に実装していきましょう！** 🚀
