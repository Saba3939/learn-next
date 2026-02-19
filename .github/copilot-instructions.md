# Copilot Instructions - Learn プロジェクト

## プロジェクト概要

Next.jsフルスタックアプリケーション開発を実践的に学習するためのハンズオンプロジェクトです。5つのアプリを段階的に作成し、実装力を養います。

**学習哲学**: 理論→実践ではなく、実践→理論。小さく始めて積み上げる。AIに依存せず自力で実装する力を身につける。

## リポジトリ構造

```
learn/
├── roadmap.md              # 全5アプリの学習ロードマップ
├── app1-note/              # アプリ1: シンプルメモアプリ
├── app2-blog/              # アプリ2: シンプルブログ
├── app3-todo/              # アプリ3: 認証付きTODOアプリ
├── app4-reading/           # アプリ4: 読書管理アプリ
└── app5-project/           # アプリ5: プロジェクト管理アプリ
```

各アプリは独立したNext.jsプロジェクトで、依存関係もデータベースも分離されています。各アプリのディレクトリ内には`docs/`フォルダがあり、要件定義と実装ガイドが含まれています。

## 共通技術スタック

- **フレームワーク**: Next.js 15+ (App Router)
- **言語**: TypeScript 5
- **データベース**: PostgreSQL 16 (Docker)
- **ORM**: Prisma 7
- **スタイリング**: Tailwind CSS 4
- **バリデーション**: Zod

後続のアプリでは、NextAuth.js (Auth.js v5)、React Hook Form、SWR/TanStack Queryなども使用します。

## ビルド、テスト、リントコマンド

### 開発
```bash
cd app<N>-<name>
npm run dev       # 開発サーバー起動（http://localhost:3000）
```

### ビルド
```bash
npm run build     # TypeScriptコンパイル + Next.jsビルド
```

### リント
```bash
npm run lint      # ESLint実行
```

### データベース
```bash
# PostgreSQL起動（各アプリディレクトリ内）
docker compose up -d

# Prismaコマンド
npx prisma migrate dev        # マイグレーション実行
npx prisma studio             # Prisma Studio GUI起動
npx prisma generate          # Prisma Client生成
```

## アーキテクチャパターン

### Prismaクライアントのセットアップ

**重要**: このプロジェクトではPrismaの出力先がカスタマイズされている場合があります。`prisma/schema.prisma`のgenerator設定を確認してください。

**Prismaクライアントシングルトン**（`src/lib/prisma.ts`）:
- `@prisma/adapter-pg`を使ってPostgreSQL接続
- `dotenv/config`で環境変数から`DATABASE_URL`を読み込み
- 開発環境でのインスタンス重複を防ぐグローバルキャッシュパターン
- **インポートパス**: `@/lib/prisma`（`tsconfig.json`でエイリアス設定）

### API Routesのパターン

このプロジェクトではRESTful API設計を学習目的で採用:

- 各ルートはHTTPメソッド名（`GET`、`POST`、`PUT`、`DELETE`）の非同期関数をエクスポート
- バリデーションにはZodスキーマを使用
- エラーメッセージは日本語で統一

### エラーハンドリング規約

```typescript
try {
  // ビジネスロジック
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "バリデーションエラー", details: error.message },
      { status: 400 }
    );
  }
  console.error("Failed to ...", error);
  return NextResponse.json(
    { error: "日本語のエラーメッセージ" },
    { status: 500 }
  );
}
```

**ポイント**:
- ユーザー向けエラーメッセージは日本語
- 技術的なエラーログは英語で`console.error`
- 常に`error`フィールドを含むJSONレスポンスを返す
- バリデーションエラー（400）とサーバーエラー（500）を明確に分ける

### Next.js 15+のDynamic Route Params

**重要な変更**: Next.js 15以降、ルートパラメータは**非同期**になりました。

```typescript
// 新しい書き方（Next.js 15+）
export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;  // paramsをawaitする
  // idを使った処理
}
```

ルートパラメータにアクセスする前に必ず`params`をawaitしてください。

## 主要な規約

### データベースID戦略

主キーには`@default(uuid())`または`@default(cuid())`を使用。

### インポートエイリアス

TypeScriptパスエイリアス:
- `@/*` → `src/*`

### 環境変数

各アプリの`.env`ファイル:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/<dbname>?schema=public"
```

### Docker設定

各アプリに`docker-compose.yml`が配置され、PostgreSQLコンテナを起動。

## 学習サポートガイドライン

このプロジェクトは以下のような開発者向けです:
- Next.jsの基本知識はある
- 実装能力を実践で身につけたい
- AIは学習補助として使い、依存しない
- 段階的なガイダンスを好む

**支援を提供する際の方針**:
1. **「なぜ」を説明する**: 単に「どうやって」だけでなく、設計判断の理由も説明
2. **ドキュメントを活用**: 各アプリの`docs/development-guide.md`を参照させ、構造化された学習を促す
3. **自己解決力を育成**: すぐに答えを提示せず、エラーメッセージの読み方やデバッグ方法をガイド
4. **公式ドキュメントへ誘導**: より深い理解のために公式ドキュメントを紹介
5. **言語の使い分け**:
   - ユーザー向けメッセージ・UI: 日本語
   - コード・技術用語・ログ: 英語
   - 説明・解説: 日本語

## 参考リソース

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Prisma ドキュメント](https://www.prisma.io/docs)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/handbook/)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)

各アプリの`roadmap.md`と`docs/requirements.md`に詳細な学習目標と機能要件が記載されています。
