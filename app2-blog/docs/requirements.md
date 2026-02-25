# アプリ2: シンプルブログ - 要件定義書
## 📋 プロジェクト概要

### 目的
Dynamic Routes、データベースリレーション、ページネーションを学ぶための実践的なブログアプリケーション

### 学習目標
- Dynamic Routesの実装方法を理解する
- Prismaでの1対多リレーションを習得する
- include/selectでのデータ取得を学ぶ
- Zodバリデーションの実装パターンを習得する
- ページネーション機能の実装方法を学ぶ
- shadcn/uiコンポーネントの活用方法を理解する
- 管理画面の設計パターンを学ぶ

---

## 🎯 機能要件

### 1. 公開ページ（フロントエンド）

#### 1.1 記事一覧ページ（トップページ）
- 公開済み記事を新着順に一覧表示
- 各記事カードには以下を表示：
  - タイトル
  - 抜粋（excerpt）
  - カテゴリー名とバッジ
  - 公開日時
  - 「続きを読む」リンク
- ページネーション（1ページあたり10記事）
- カテゴリーフィルター（サイドバーまたはタブ）
- 「すべて」「カテゴリーA」「カテゴリーB」などで絞り込み

#### 1.2 記事詳細ページ
- Dynamic Routes (`/posts/[slug]`)
- 記事の全情報を表示：
  - タイトル
  - カテゴリーバッジ
  - 公開日時
  - 本文（マークダウン対応は後回し、まずはテキスト）
- 同じカテゴリーの関連記事を表示（最大3件）
- 一覧へ戻るボタン

#### 1.3 カテゴリー別記事一覧ページ
- Dynamic Routes (`/categories/[slug]`)
- 特定カテゴリーの記事一覧
- ページネーション対応

### 2. 管理画面

#### 2.1 記事管理画面（`/admin/posts`）
- すべての記事を一覧表示（公開・非公開含む）
- 各行に以下を表示：
  - タイトル
  - カテゴリー
  - 公開ステータス（バッジ）
  - 作成日時
  - 編集・削除ボタン
- 「新規記事作成」ボタン

#### 2.2 記事作成画面（`/admin/posts/create`）
- タイトル入力欄（必須）
- Slugフィールド（英数字とハイフンのみ、一意制約）
- カテゴリー選択（ドロップダウン）
- 抜粋（excerpt）入力欄（任意）
- 本文入力欄（必須、テキストエリア）
- 公開ステータストグル（公開/下書き）
- プレビューボタン（後回しでも可）
- 保存ボタン・キャンセルボタン

#### 2.3 記事編集画面（`/admin/posts/edit/[id]`）
- 作成画面と同じフォーム
- 既存データを初期値として表示
- Slug変更の警告（既にリンクされている場合）

#### 2.4 カテゴリー管理画面（`/admin/categories`）
- カテゴリー一覧表示
- カテゴリー名・Slug・記事数を表示
- 新規カテゴリー作成フォーム（インライン）
- 編集・削除機能
- 削除時の確認ダイアログ（記事が紐づいている場合は警告）

---

## 🗄️ データベース設計

### ERD概要
```
Category (1) ─── (Many) Post
```

### Categoryモデル

| フィールド | 型 | 制約 | 説明 |
|-----------|-------|------|------|
| id | String | PK, @default(cuid()) | 一意識別子 |
| name | String | Required, Unique | カテゴリー名（日本語可） |
| slug | String | Required, Unique | URL用スラッグ（英数字） |
| description | String? | Optional | カテゴリーの説明 |
| createdAt | DateTime | @default(now()) | 作成日時 |
| updatedAt | DateTime | @updatedAt | 更新日時 |
| posts | Post[] | Relation | 関連記事 |

### Postモデル

| フィールド | 型 | 制約 | 説明 |
|-----------|-------|------|------|
| id | String | PK, @default(cuid()) | 一意識別子 |
| title | String | Required | 記事タイトル |
| slug | String | Required, Unique | URL用スラッグ |
| excerpt | String? | Optional | 記事の抜粋（150文字程度） |
| content | String | Required | 記事本文 |
| published | Boolean | @default(false) | 公開ステータス |
| categoryId | String | Required, FK | カテゴリーID |
| category | Category | Relation | 所属カテゴリー |
| publishedAt | DateTime? | Optional | 公開日時 |
| createdAt | DateTime | @default(now()) | 作成日時 |
| updatedAt | DateTime | @updatedAt | 更新日時 |

### Prismaスキーマ

```prisma
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  posts       Post[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String?
  content     String    @db.Text
  published   Boolean   @default(false)
  publishedAt DateTime?
  category    Category  @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  categoryId  String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([categoryId])
  @@index([slug])
  @@index([published])
}
```

---

## 🎨 UI/UX要件

### デザイン方針
- **shadcn/ui**を全面的に活用
- クリーンで読みやすいブログデザイン
- モバイルファーストのレスポンシブデザイン
- アクセシビリティに配慮

### 使用するshadcn/uiコンポーネント

#### 公開ページ
- `Card` - 記事カード
- `Badge` - カテゴリーバッジ、公開ステータス
- `Button` - アクションボタン
- `Separator` - セクション区切り
- `Pagination` - ページネーション（後でインストール予定）

#### 管理画面
- `Form` - フォーム全般
- `Input` - テキスト入力
- `Textarea` - 長文入力
- `Select` - ドロップダウン選択
- `Switch` - 公開/下書きトグル
- `Table` - 記事一覧・カテゴリー一覧
- `Dialog` - 削除確認ダイアログ
- `Alert` - エラー・成功メッセージ
- `Label` - フォームラベル

### レイアウト構成

#### 公開ページレイアウト
```
┌─────────────────────────────────────────┐
│  Header (ブログタイトル・ナビゲーション)   │
├─────────────────────────────────────────┤
│  Main Content                            │
│  ┌─────────────────┬─────────────────┐  │
│  │ Article List    │ Sidebar         │  │
│  │                 │ - Categories    │  │
│  │ [Card]          │ - Recent Posts  │  │
│  │ [Card]          │                 │  │
│  │ [Card]          │                 │  │
│  │                 │                 │  │
│  │ [Pagination]    │                 │  │
│  └─────────────────┴─────────────────┘  │
└─────────────────────────────────────────┘
```

#### 管理画面レイアウト
```
┌─────────────────────────────────────────┐
│  Admin Header (+ 新規作成ボタン)        │
├─────────────────────────────────────────┤
│  Tabs: [記事管理] [カテゴリー管理]      │
├─────────────────────────────────────────┤
│  Table                                   │
│  ┌─────┬──────┬─────────┬──────────┐   │
│  │Title│Categ.│Published│Actions   │   │
│  ├─────┼──────┼─────────┼──────────┤   │
│  │ ... │ ... │  Badge  │ Edit Del │   │
│  │ ... │ ... │  Badge  │ Edit Del │   │
│  └─────┴──────┴─────────┴──────────┘   │
└─────────────────────────────────────────┘
```

### カラースキーム
- プライマリ: Slate/Zinc（shadcn/uiのデフォルト）
- アクセント: 記事カテゴリーごとに色分け可能
- 公開ステータス:
  - 公開済み: Green badge
  - 下書き: Gray badge

---

## 🛠️ 技術要件

### フロントエンド
- **Next.js 15+** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** - UIコンポーネントライブラリ

### バックエンド
- **Next.js API Routes**
- **Prisma ORM 7**
- **PostgreSQL** (ローカル Docker)
- **Zod** (バリデーション)

### 開発ツール
- **Node.js** 20.x以上
- **npm** または **pnpm**
- **Docker** (PostgreSQL用)

---

## 📁 ディレクトリ構造

```
app2-blog/
├── docs/
│   ├── requirements.md          # このファイル
│   └── development-guide.md     # 開発ガイド
├── prisma/
│   ├── schema.prisma            # Prismaスキーマ
│   └── seed.ts                  # シードデータ（オプション）
├── src/
│   ├── app/
│   │   ├── layout.tsx           # ルートレイアウト
│   │   ├── page.tsx             # トップページ（記事一覧）
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # 記事詳細
│   │   ├── categories/
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # カテゴリー別記事一覧
│   │   ├── admin/
│   │   │   ├── layout.tsx       # 管理画面レイアウト
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx     # 記事管理
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx # 記事作成
│   │   │   │   └── edit/
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx # 記事編集
│   │   │   └── categories/
│   │   │       └── page.tsx     # カテゴリー管理
│   │   └── api/
│   │       ├── posts/
│   │       │   ├── route.ts     # GET (一覧), POST (作成)
│   │       │   ├── [id]/
│   │       │   │   └── route.ts # GET, PUT, DELETE
│   │       │   └── by-slug/
│   │       │       └── [slug]/
│   │       │           └── route.ts # Slugで記事取得
│   │       └── categories/
│   │           ├── route.ts     # GET, POST
│   │           └── [id]/
│   │               └── route.ts # GET, PUT, DELETE
│   ├── components/
│   │   ├── ui/                  # shadcn/uiコンポーネント
│   │   ├── post-card.tsx        # 記事カードコンポーネント
│   │   ├── category-badge.tsx   # カテゴリーバッジ
│   │   ├── post-list.tsx        # 記事一覧
│   │   └── pagination.tsx       # ページネーション
│   └── lib/
│       ├── prisma.ts            # Prismaクライアント
│       ├── utils.ts             # ユーティリティ関数
│       └── validations.ts       # Zodスキーマ
├── .env
├── docker-compose.yml
├── components.json              # shadcn/ui設定
├── package.json
└── tsconfig.json
```

---

## ✅ 受け入れ基準

### 完了の定義
以下がすべて動作すれば完了：

#### 公開ページ
1. [ ] トップページで公開記事の一覧が表示される
2. [ ] カテゴリーでフィルタリングできる
3. [ ] ページネーションが動作する
4. [ ] 記事詳細ページが表示される（Dynamic Routes）
5. [ ] カテゴリー別記事一覧ページが表示される
6. [ ] レスポンシブデザインが動作する

#### 管理画面
7. [ ] 記事を新規作成できる
8. [ ] 記事を編集できる
9. [ ] 記事を削除できる
10. [ ] 公開/下書きステータスを切り替えられる
11. [ ] カテゴリーを作成・編集・削除できる
12. [ ] フォームバリデーションが動作する

#### 技術要件
13. [ ] TypeScriptのコンパイルエラーがない
14. [ ] Prismaのリレーションが正しく動作する
15. [ ] Zodバリデーションが適切に機能する
16. [ ] エラーハンドリングが適切に実装されている

---

## 🎓 学習ポイント

### このアプリで身につくスキル

#### 1. Dynamic Routes
- `[slug]`を使った動的ルーティング
- `generateStaticParams`での静的生成（オプション）
- paramsの取得と使用方法
- 404ハンドリング

#### 2. Prismaリレーション
- 1対多のリレーション定義
- `include`での関連データ取得
- `select`での特定フィールド取得
- リレーションのフィルタリング
- `onDelete`制約の理解

#### 3. ページネーション
- オフセットベースのページネーション
- `skip`と`take`の使い方
- ページ数計算
- URLクエリパラメータの活用

#### 4. Zodバリデーション
- 複雑なスキーマ定義
- カスタムバリデーションルール
- エラーメッセージのカスタマイズ
- フロントエンドでの活用

#### 5. shadcn/ui
- コンポーネントのインストールと使用
- Formコンポーネントとの統合
- カスタマイズ方法
- アクセシビリティ対応

#### 6. 管理画面設計
- レイアウトの分離
- CRUD操作のUIパターン
- ユーザーフィードバック（Toast通知など）

---

## 📚 参考リソース

### 公式ドキュメント
- [Next.js Documentation - Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Prisma Documentation - Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Zod Documentation](https://zod.dev/)

### shadcn/ui特有のリソース
- [shadcn/ui - Installation Guide](https://ui.shadcn.com/docs/installation/next)
- [shadcn/ui - Form Component](https://ui.shadcn.com/docs/components/form)
- [shadcn/ui - Data Table](https://ui.shadcn.com/docs/components/data-table)

---

## 🔄 アプリ1との違い

### 新しく学ぶこと
- ✅ Dynamic Routes（`[slug]`パターン）
- ✅ データベースリレーション（1対多）
- ✅ ページネーション
- ✅ shadcn/uiの活用
- ✅ 管理画面と公開画面の分離

### アプリ1で学んだことの発展
- ✅ より複雑なAPI設計
- ✅ より高度なバリデーション
- ✅ より洗練されたUI/UX

---

**準備ができたら development-guide.md を参照して実装を始めましょう！** 🚀
