import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  // 既存データをクリア（開発用）
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();

  // カテゴリー作成
  const tech = await prisma.category.create({
    data: {
      name: "技術",
      slug: "tech",
      description: "プログラミングやソフトウェア開発に関する記事",
    },
  });

  const design = await prisma.category.create({
    data: {
      name: "デザイン",
      slug: "design",
      description: "UIデザイン・UXデザインに関する記事",
    },
  });

  const business = await prisma.category.create({
    data: {
      name: "ビジネス",
      slug: "business",
      description: "ビジネス戦略・マーケティングに関する記事",
    },
  });

  const lifestyle = await prisma.category.create({
    data: {
      name: "ライフスタイル",
      slug: "lifestyle",
      description: "日常生活・自己啓発に関する記事",
    },
  });

  // 記事作成
  const now = new Date();

  await prisma.post.createMany({
    data: [
      // 技術カテゴリー
      {
        title: "Next.js 15 の新機能まとめ",
        slug: "nextjs-15-new-features",
        excerpt: "Next.js 15で追加された主要な新機能を紹介します。",
        content: `Next.js 15では多くの改善が行われました。\n\n## async params\nNext.js 15からルートパラメータが非同期になりました。paramsをawaitする必要があります。\n\n## Turbopack\nビルドツールとしてTurbopackが安定版になりました。`,
        published: true,
        publishedAt: now,
        categoryId: tech.id,
      },
      {
        title: "Prismaで1対多リレーションを実装する",
        slug: "prisma-one-to-many-relation",
        excerpt: "PrismaのリレーションをTypeScriptで型安全に扱う方法を解説します。",
        content: `Prismaではスキーマファイルでリレーションを定義します。\n\n## 1対多の定義\n\`@relation\`属性を使って外部キーを設定します。\n\n##
  includeでデータ取得\nfindManyにincludeオプションを渡すことで関連データを一括取得できます。`,
        published: true,
        publishedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        categoryId: tech.id,
      },
      {
        title: "TypeScriptの型ガードを使いこなす",
        slug: "typescript-type-guards",
        excerpt: "型ガードを活用してTypeScriptのコードをより安全にする方法を紹介します。",
        content: `型ガードはランタイムで型を絞り込むための仕組みです。\n\n## typeof\nプリミティブ型の絞り込みに使います。\n\n## instanceof\nクラスインスタンスの判定に使います。`,
        published: false, // 下書き
        publishedAt: null,
        categoryId: tech.id,
      },

      // デザインカテゴリー
      {
        title: "shadcn/ui を Next.js に導入する",
        slug: "shadcn-ui-setup",
        excerpt: "shadcn/uiのセットアップ手順と基本的なコンポーネントの使い方を解説します。",
        content: `shadcn/uiはコピーペーストで使えるReactコンポーネント集です。\n\n## インストール\nnpx shadcn@latest initで初期化します。\n\n## コンポーネント追加\nnpx shadcn@latest add buttonでコンポーネントを追加します。`,
        published: true,
        publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        categoryId: design.id,
      },
      {
        title: "Tailwind CSS でレスポンシブデザインを実装する",
        slug: "tailwind-responsive-design",
        excerpt: "Tailwind CSSのブレークポイントを使ったレスポンシブ対応の実践的な方法を紹介します。",
        content: `Tailwind CSSはユーティリティファーストのCSSフレームワークです。\n\n## ブレークポイント\nsm・md・lg・xlのプレフィックスでレスポンシブを制御します。`,
        published: true,
        publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        categoryId: design.id,
      },
      {
        title: "カラーパレットの選び方",
        slug: "how-to-choose-color-palette",
        excerpt: "Webデザインで使えるカラーパレットの基本的な選び方を解説します。",
        content: `良いカラーパレットはユーザー体験を大きく向上させます。\n\n## 60-30-10ルール\nメインカラー60%、サブカラー30%、アクセントカラー10%の比率が基本です。`,
        published: false, // 下書き
        publishedAt: null,
        categoryId: design.id,
      },

      // ビジネスカテゴリー
      {
        title: "スタートアップが最初に考えるべきこと",
        slug: "startup-first-steps",
        excerpt: "スタートアップ立ち上げ時に最初に取り組むべき重要なポイントを解説します。",
        content: `スタートアップの成功には明確な問題定義が不可欠です。\n\n## 問題の特定\n解決すべき問題を明確にすることが最初のステップです。\n\n## MVP\n最小限の機能で検証することが重要です。`,
        published: true,
        publishedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        categoryId: business.id,
      },
      {
        title: "エンジニアのためのキャリア設計",
        slug: "engineer-career-design",
        excerpt: "エンジニアとしてのキャリアを戦略的に設計するための考え方を紹介します。",
        content: `エンジニアのキャリアは技術力だけで決まりません。\n\n## 専門性と汎用性\nT字型のスキルセットを目指しましょう。\n\n## 発信の重要性\nブログや登壇でアウトプットすることがキャリアに繋がります。`,
        published: true,
        publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        categoryId: business.id,
      },

      // ライフスタイルカテゴリー
      {
        title: "エンジニアの勉強習慣を作る方法",
        slug: "engineer-study-habits",
        excerpt: "忙しいエンジニアが継続的に学習し続けるための習慣づくりを紹介します。",
        content: `技術は常に変化するため、継続的な学習が必要です。\n\n## 毎日15分\n短時間でも毎日続けることが大切です。\n\n## アウトプット学習\n学んだことを書くことで記憶に定着します。`,
        published: true,
        publishedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        categoryId: lifestyle.id,
      },
      {
        title: "リモートワークで生産性を上げる環境づくり",
        slug: "remote-work-productivity",
        excerpt: "在宅勤務で集中力を保ち、生産性を最大化するための環境整備を解説します。",
        content: `リモートワークでは自己管理が重要になります。\n\n## 専用の作業スペース\n仕事と生活を分けるための場所を確保しましょう。\n\n## タイムボックス\nポモドーロテクニックで集中と休憩を繰り返します。`,
        published: true,
        publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        categoryId: lifestyle.id,
      },
      {
        title: "技術書の効率的な読み方",
        slug: "how-to-read-tech-books",
        excerpt: "厚い技術書を効率よく読み、実践に活かすための読書術を紹介します。",
        content: `技術書は最初から全部読む必要はありません。\n\n## 目次から始める\n全体像を把握してから読む章を選びましょう。\n\n## 手を動かす\n読みながらコードを書くことで理解が深まります。`,
        published: false, // 下書き
        publishedAt: null,
        categoryId: lifestyle.id,
      },
    ],
  });

  console.log("Seed completed!");
  console.log(`- Categories: 4`);
  console.log(`- Posts: 11 (8 published, 3 drafts)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
