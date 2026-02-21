# アプリ2: シンプルブログ - 開発ガイド

## 🎯 このガイドの目的

このガイドでは、ブログアプリを**段階的に**実装していきます。
アプリ1で学んだ基礎の上に、新しいスキル（Dynamic Routes、リレーション、ページネーション、shadcn/ui）を積み上げていきます。

**重要**: 具体的なコード実装は省略し、**アプローチと実装の順番**に焦点を当てています。

---

## 📋 開発の全体フロー

```
1. 環境構築・プロジェクト初期化 (1時間)
   ↓
2. shadcn/uiのセットアップ (30分)
   ↓
3. データベーススキーマ設計 (30分)
   ↓
4. シードデータ作成（オプション） (30分)
   ↓
5. カテゴリーAPI実装 (1-2時間)
   ↓
6. 記事API実装 (2-3時間)
   ↓
7. 公開ページ: 記事一覧 (2-3時間)
   ↓
8. 公開ページ: 記事詳細 (1-2時間)
   ↓
9. 公開ページ: カテゴリー別一覧 (1-2時間)
   ↓
10. 管理画面: カテゴリー管理 (2-3時間)
    ↓
11. 管理画面: 記事管理（一覧） (2-3時間)
    ↓
12. 管理画面: 記事作成 (2-3時間)
    ↓
13. 管理画面: 記事編集 (1-2時間)
    ↓
14. ページネーション実装 (2-3時間)
    ↓
15. UIの改善・最終調整 (2-3時間)
```

**合計見込み時間**: 20-30時間（初学者ペース）

---

## フェーズ1: 環境構築・プロジェクト初期化

### 目標
Next.jsプロジェクトを作成し、基本的な開発環境を整える

### ステップ概要

#### 1-1. PostgreSQLをDockerで起動
- Docker Composeファイルを作成
- データベース名: `blog_db`
- ポート: 5432
- コンテナ起動確認

#### 1-2. Next.jsプロジェクト作成
- `create-next-app`を使用
- TypeScript、Tailwind CSS、App Router、src directoryを有効化
- プロジェクト構造を確認

#### 1-3. 必要なパッケージをインストール
- Prisma関連: `prisma`, `@prisma/client`
- バリデーション: `zod`
- shadcn/ui用: `class-variance-authority`, `clsx`, `tailwind-merge`（shadcn initで自動インストール）
- 日付フォーマット: `date-fns`（オプション）

#### 1-4. Prismaの初期化
- `npx prisma init`を実行
- `.env`ファイルにDATABASE_URLを設定
- `src/lib/prisma.ts`を作成（シングルトンパターン）

### 学習ポイント
- プロジェクト初期化の一連の流れを身につける
- 環境変数管理の重要性を理解する

---

## フェーズ2: shadcn/uiのセットアップ

### 目標
shadcn/uiを導入し、基本的なコンポーネントをインストールする

### ステップ概要

#### 2-1. shadcn/uiの初期化
- `npx shadcn@latest init`を実行
- スタイル、カラー、CSSバリアブルの選択
- `components.json`の生成を確認

#### 2-2. 必要なコンポーネントをインストール
**最初にインストールするコンポーネント**:
- `button` - 基本的なアクションボタン
- `card` - 記事カード用
- `badge` - カテゴリーやステータス表示
- `separator` - セクション区切り

**後でインストールするコンポーネント**（使用する際に）:
- `form`, `input`, `textarea`, `select`, `label` - フォーム関連
- `table` - 管理画面の一覧表示
- `dialog` - 削除確認
- `switch` - 公開/下書きトグル
- `alert` - エラー・成功メッセージ
- `tabs` - 管理画面のタブ切り替え

#### 2-3. 動作確認
- `src/app/page.tsx`にButtonコンポーネントを配置
- スタイルが正しく適用されることを確認

### 学習ポイント
- shadcn/uiのインストール方法
- 必要に応じてコンポーネントを追加する考え方
- Tailwind CSSとの統合

---

## フェーズ3: データベーススキーマ設計

### 目標
CategoryとPostの1対多リレーションを定義し、マイグレーションを実行する

### ステップ概要

#### 3-1. Prismaスキーマを定義
**Categoryモデル**:
- フィールド: id, name, slug, description, createdAt, updatedAt
- Uniqueインデックス: name, slug
- Relation: posts（Post[]）

**Postモデル**:
- フィールド: id, title, slug, excerpt, content, published, publishedAt, categoryId, createdAt, updatedAt
- Uniqueインデックス: slug
- Relation: category（Category）
- インデックス: categoryId, slug, published（検索最適化）

**リレーションの定義方法**:
- `@relation`属性を使用
- `fields`と`references`を明示
- `onDelete: Restrict`で関連レコードがある場合の削除を防止

#### 3-2. マイグレーションを実行
- `npx prisma migrate dev --name init`
- データベースにテーブルが作成されることを確認
- Prisma Clientが自動生成される

#### 3-3. Prisma Studioで確認
- `npx prisma studio`を起動
- 空のテーブルが表示されることを確認

### 学習ポイント
- 1対多リレーションの定義方法
- Prismaの制約とインデックスの使い方
- マイグレーションの仕組み

---

## フェーズ4: シードデータ作成（オプション）

### 目標
開発用のサンプルデータを作成し、効率的にテストできるようにする

### ステップ概要

#### 4-1. シードスクリプトを作成
- `prisma/seed.ts`を作成
- カテゴリーを3-5個作成（例: 技術、デザイン、ビジネス）
- 各カテゴリーに記事を10-15個作成
- 公開/下書きをランダムに設定

#### 4-2. package.jsonにシード設定を追加
- `prisma.seed`フィールドを追加
- 実行コマンドを指定

#### 4-3. シードを実行
- `npx prisma db seed`
- Prisma Studioで確認

### 学習ポイント
- シードデータの重要性
- 開発効率を上げる工夫

**注意**: このフェーズはスキップしても構いません。API経由で手動でデータを作成することも可能です。

---

## フェーズ5: カテゴリーAPI実装

### 目標
カテゴリーのCRUD操作を行うAPIエンドポイントを実装する

### ステップ概要

#### 5-1. バリデーションスキーマを定義
- `src/lib/validations.ts`を作成
- Zodでカテゴリーのスキーマを定義
  - name: 必須、1文字以上
  - slug: 必須、英数字とハイフンのみ、小文字
  - description: 任意

#### 5-2. カテゴリー一覧・作成API
- `src/app/api/categories/route.ts`を作成
- **GET**: すべてのカテゴリーを取得（記事数も含める）
  - `include: { _count: { select: { posts: true } } }`を使用
- **POST**: 新しいカテゴリーを作成
  - バリデーション→重複チェック→作成

#### 5-3. カテゴリー個別取得・更新・削除API
- `src/app/api/categories/[id]/route.ts`を作成
- **GET**: IDで特定のカテゴリーを取得
- **PUT**: カテゴリーを更新
- **DELETE**: カテゴリーを削除
  - 関連記事がある場合はエラーを返す

### 学習ポイント
- Prismaの`_count`を使った集計
- リレーションを考慮した削除処理
- Slugのバリデーション

### テスト方法
- curlまたはPostmanでAPIをテスト
- 正常系・異常系の両方を確認

---

## フェーズ6: 記事API実装

### 目標
記事のCRUD操作を行うAPIエンドポイントを実装する（リレーション含む）

### ステップ概要

#### 6-1. バリデーションスキーマを定義
- `src/lib/validations.ts`に記事のスキーマを追加
  - title: 必須、1文字以上
  - slug: 必須、英数字とハイフンのみ
  - excerpt: 任意、最大200文字
  - content: 必須、1文字以上
  - published: boolean
  - categoryId: 必須、CUID形式

#### 6-2. 記事一覧・作成API
- `src/app/api/posts/route.ts`を作成
- **GET**: 記事一覧取得
  - クエリパラメータで公開フィルター: `?published=true`
  - クエリパラメータでカテゴリーフィルター: `?categoryId=xxx`
  - ページネーション: `?page=1&limit=10`
  - `include: { category: true }`で関連カテゴリーも取得
  - `orderBy: { createdAt: 'desc' }`で新着順
- **POST**: 新しい記事を作成
  - バリデーション→Slug重複チェック→カテゴリー存在確認→作成
  - `published`がtrueの場合、`publishedAt`を現在時刻に設定

#### 6-3. 記事個別取得・更新・削除API
- `src/app/api/posts/[id]/route.ts`を作成
- **GET**: IDで特定の記事を取得（カテゴリー情報含む）
- **PUT**: 記事を更新
  - `published`がfalse→trueに変更された場合、`publishedAt`を設定
- **DELETE**: 記事を削除（制約なし）

#### 6-4. Slugで記事取得API（公開ページ用）
- `src/app/api/posts/by-slug/[slug]/route.ts`を作成
- **GET**: Slugで記事を取得
  - 公開済み記事のみを対象
  - カテゴリー情報を含める
  - 404エラーハンドリング

### 学習ポイント
- クエリパラメータを使ったフィルタリング
- ページネーションの計算方法（skip/take）
- リレーションデータの取得（include vs select）
- 条件付きフィールド更新（publishedAt）

### テスト方法
- 各エンドポイントをcurlでテスト
- フィルター、ページネーションの動作確認

---

## フェーズ7: 公開ページ - 記事一覧

### 目標
トップページに記事一覧を表示し、カテゴリーフィルターとページネーションを実装する

### ステップ概要

#### 7-1. 記事カードコンポーネントを作成
- `src/components/post-card.tsx`を作成
- shadcn/uiの`Card`コンポーネントを活用
- 表示内容: タイトル、抜粋、カテゴリーバッジ、公開日時
- リンク: `/posts/[slug]`

#### 7-2. カテゴリーバッジコンポーネントを作成
- `src/components/category-badge.tsx`を作成
- shadcn/uiの`Badge`を使用
- カテゴリー名を表示

#### 7-3. トップページを実装
- `src/app/page.tsx`を編集
- **Server Component**として実装（初期表示はSSR）
- クエリパラメータから`page`と`categoryId`を取得
- API（内部で直接Prismaを使用でもOK）から記事一覧を取得
- 記事カードを並べて表示
- サイドバーにカテゴリー一覧を表示（フィルターリンク）

#### 7-4. ページネーションコンポーネントを作成
- `src/components/pagination.tsx`を作成
- shadcn/uiの`Button`を使用
- 前へ・次へボタン、ページ番号表示
- Link（`next/link`）を使ってページ遷移

### 学習ポイント
- Server Componentでのデータフェッチ
- searchParamsの取得方法（Next.js 15ではasync）
- コンポーネントの再利用性
- ページネーションのロジック

### UIのポイント
- 記事カードはグリッドレイアウト（`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`）
- レスポンシブデザインを意識
- 読み込み中はスケルトンまたはローディングを表示

---

## フェーズ8: 公開ページ - 記事詳細

### 目標
Dynamic Routesを使って記事詳細ページを実装する

### ステップ概要

#### 8-1. 記事詳細ページを作成
- `src/app/posts/[slug]/page.tsx`を作成
- `params`から`slug`を取得（**async/await必須** - Next.js 15+）
- API（または直接Prisma）でSlugから記事を取得
- 記事が見つからない場合は`notFound()`を呼び出す

#### 8-2. 記事詳細UIを実装
- タイトル、カテゴリーバッジ、公開日時を表示
- 本文を表示（マークダウンレンダリングは後回し）
- 一覧に戻るボタン

#### 8-3. 関連記事を表示（オプション）
- 同じカテゴリーの記事を最大3件取得
- 記事カードコンポーネントを再利用

#### 8-4. メタデータを設定
- `generateMetadata`関数を実装
- タイトル、description（excerpt）、OGP設定

### 学習ポイント
- Dynamic Routesの実装方法
- `notFound()`の使い方
- `generateMetadata`でのSEO対策
- Next.js 15の`params`の非同期処理

### UIのポイント
- 記事本文は適切な行間・余白で読みやすく
- レスポンシブ対応（モバイルでは1カラム）

---

## フェーズ9: 公開ページ - カテゴリー別記事一覧

### 目標
カテゴリー別の記事一覧ページを実装する（Dynamic Routes + ページネーション）

### ステップ概要

#### 9-1. カテゴリー別記事一覧ページを作成
- `src/app/categories/[slug]/page.tsx`を作成
- `params`から`slug`を取得
- Slugでカテゴリーを取得（存在確認）
- そのカテゴリーに属する記事を取得（公開済みのみ）
- ページネーション対応

#### 9-2. UIを実装
- カテゴリー名をページタイトルに表示
- カテゴリーの説明を表示（あれば）
- 記事カードを並べる（トップページと同じコンポーネント）
- ページネーション

### 学習ポイント
- Dynamic Routesでのフィルタリング
- Prismaでのリレーションを使った絞り込み

### UIのポイント
- トップページとの一貫性を保つ
- パンくずリストを追加すると◎

---

## フェーズ10: 管理画面 - カテゴリー管理

### 目標
カテゴリーの作成・編集・削除を行う管理画面を実装する

### ステップ概要

#### 10-1. 管理画面レイアウトを作成
- `src/app/admin/layout.tsx`を作成
- ヘッダー、ナビゲーションを配置
- 「記事管理」「カテゴリー管理」のリンク

#### 10-2. カテゴリー管理ページを作成
- `src/app/admin/categories/page.tsx`を作成
- カテゴリー一覧をshadcn/uiの`Table`で表示
- 各行に編集・削除ボタン

#### 10-3. 新規カテゴリー作成フォーム
- ページ上部にフォームを配置（インライン）
- shadcn/uiの`Form`, `Input`, `Textarea`を使用
- バリデーション: Zodスキーマ
- 送信後、APIを呼び出してカテゴリー作成
- 成功したらリストを再読み込み

#### 10-4. カテゴリー編集機能
- **方法1**: インラインで編集（行をクリックすると編集モード）
- **方法2**: Dialogで編集フォームを表示（推奨）
- shadcn/uiの`Dialog`を使用
- 既存データを初期値として表示
- 更新APIを呼び出し

#### 10-5. カテゴリー削除機能
- 削除ボタンをクリック
- shadcn/uiの`Dialog`で確認
- 関連記事がある場合はエラーメッセージを表示
- 削除APIを呼び出し

### 学習ポイント
- shadcn/uiのFormコンポーネントの使い方
- Dialogでのモーダル実装
- 楽観的UI更新（オプション）

### UIのポイント
- 編集・削除は慎重に（確認ダイアログ必須）
- エラー・成功メッセージを表示（Toast推奨）

---

## フェーズ11: 管理画面 - 記事管理（一覧）

### 目標
記事の一覧を表示し、編集・削除ボタンを配置する

### ステップ概要

#### 11-1. 記事管理ページを作成
- `src/app/admin/posts/page.tsx`を作成
- すべての記事を取得（公開・下書き含む）
- shadcn/uiの`Table`で表示

#### 11-2. テーブルの列構成
- タイトル
- カテゴリー名
- 公開ステータス（`Badge`で色分け）
- 作成日時
- アクション（編集・削除ボタン）

#### 11-3. フィルタリング機能（オプション）
- 公開/下書きでフィルタ
- カテゴリーでフィルタ
- shadcn/uiの`Select`または`Tabs`を使用

#### 11-4. 削除機能
- 削除ボタン→確認Dialog→API呼び出し
- 成功後、リストを再読み込み

### 学習ポイント
- 管理画面でのデータ一覧表示パターン
- StatusバッジのUI実装

### UIのポイント
- ページ上部に「+ 新規記事作成」ボタン
- ページネーション対応（記事が多い場合）

---

## フェーズ12: 管理画面 - 記事作成

### 目標
記事を新規作成するフォームを実装する

### ステップ概要

#### 12-1. 記事作成ページを作成
- `src/app/admin/posts/create/page.tsx`を作成
- shadcn/uiの`Form`を使用

#### 12-2. フォームフィールドを配置
- タイトル: `Input`（必須）
- Slug: `Input`（必須、バリデーション付き）
  - リアルタイムでタイトルから自動生成（オプション）
- カテゴリー: `Select`（必須）
  - カテゴリー一覧をAPIから取得
- 抜粋: `Textarea`（任意）
- 本文: `Textarea`（必須、高さ大きめ）
- 公開ステータス: `Switch`（初期値: 下書き）

#### 12-3. バリデーション
- Zodスキーマでフロントエンド検証
- APIでもバックエンド検証

#### 12-4. 送信処理
- フォーム送信→APIを呼び出し
- 成功→記事管理ページへリダイレクト
- エラー→エラーメッセージを表示

### 学習ポイント
- shadcn/uiのFormとReact Hook Formの統合
- 動的なカテゴリー選択の実装
- Slugの自動生成ロジック

### UIのポイント
- フォームは左右余白を持たせて中央配置
- 保存・キャンセルボタンを分かりやすく
- 保存中はボタンをdisableに

---

## フェーズ13: 管理画面 - 記事編集

### 目標
既存記事を編集するフォームを実装する

### ステップ概要

#### 13-1. 記事編集ページを作成
- `src/app/admin/posts/edit/[id]/page.tsx`を作成
- Dynamic Routesで記事IDを取得
- 記事データをAPIから取得

#### 13-2. フォームを実装
- 作成フォームと同じフィールド
- 既存データを初期値として表示
- `defaultValues`を使用

#### 13-3. 更新処理
- フォーム送信→PUT APIを呼び出し
- 成功→記事管理ページへリダイレクト

#### 13-4. Slug変更の警告（オプション）
- Slugが変更された場合、警告メッセージを表示
- 既存のリンクが切れる可能性を通知

### 学習ポイント
- Dynamic Routesでのデータ取得と初期化
- フォームの初期値設定

### UIのポイント
- 作成と編集でコンポーネントを共有する設計も検討可能

---

## フェーズ14: ページネーション実装

### 目標
すべての一覧ページにページネーションを実装する

### ステップ概要

#### 14-1. ページネーションロジックを共通化
- `src/lib/utils.ts`にページネーション用関数を追加
- 総ページ数計算: `Math.ceil(totalCount / limit)`
- skip計算: `(page - 1) * limit`

#### 14-2. APIでページネーション対応
- 記事一覧APIに`page`と`limit`パラメータを追加
- `skip`と`take`を使ってPrismaクエリを作成
- 総件数も返す（`count()`を使用）

#### 14-3. UIコンポーネントを改善
- ページネーションコンポーネントにページ番号ボタンを追加
- 現在のページをハイライト
- 前へ・次へボタンのdisable制御

#### 14-4. すべての一覧ページに適用
- トップページ
- カテゴリー別一覧
- 管理画面の記事一覧

### 学習ポイント
- オフセットベースのページネーション
- ページ番号の計算
- URLクエリパラメータとの連携

---

## フェーズ15: UIの改善・最終調整

### 目標
アプリ全体のUI/UXを改善し、完成度を高める

### ステップ概要

#### 15-1. レスポンシブデザインの確認
- モバイル、タブレット、デスクトップでの表示確認
- メニュー、フォームの使いやすさをチェック

#### 15-2. エラーハンドリングの改善
- 404ページのカスタマイズ
- エラーバウンダリの実装（`error.tsx`）
- フォームエラーの分かりやすい表示

#### 15-3. ローディング状態の改善
- `loading.tsx`を追加
- スケルトンスクリーンの実装
- ボタンのローディング状態

#### 15-4. アクセシビリティの確認
- キーボード操作の確認
- スクリーンリーダー対応
- `aria-label`の追加

#### 15-5. パフォーマンス最適化（オプション）
- 画像最適化（`next/image`）
- Dynamic Importでコンポーネント遅延読み込み
- Prismaクエリの最適化（N+1問題の確認）

#### 15-6. 最終テスト
- すべての機能をエンドツーエンドでテスト
- エッジケースの確認
- TypeScriptエラーがないか確認（`npm run build`）

### 学習ポイント
- プロダクションレディなアプリの条件
- パフォーマンスとアクセシビリティの重要性

---

## 🎓 追加学習項目（オプション）

### 1. マークダウンサポート
- `react-markdown`をインストール
- 記事本文をマークダウンでレンダリング
- コードハイライト（`react-syntax-highlighter`）

### 2. 画像アップロード
- カテゴリーやPostにカバー画像フィールドを追加
- ファイルアップロードAPIを実装
- 画像をpublic/uploadsに保存（後でCloudinaryやS3へ移行）

### 3. 検索機能
- 記事タイトル・本文で全文検索
- PrismaのフィルタリングまたはPostgreSQLのFull-Text Search

### 4. 下書きプレビュー
- 下書き記事を特別なURLでプレビュー
- `/posts/[slug]?preview=true`のようなクエリパラメータ

### 5. Toast通知
- shadcn/uiの`Toast`コンポーネント
- 作成・更新・削除の成功/失敗を通知

### 6. SEO最適化
- サイトマップ生成（`sitemap.xml`）
- RSSフィード生成
- 構造化データ（JSON-LD）

---

## 🚀 完成後の確認事項

### 機能チェックリスト
- [ ] 記事一覧が表示される
- [ ] カテゴリーでフィルタリングできる
- [ ] ページネーションが動作する
- [ ] 記事詳細が表示される（Dynamic Routes）
- [ ] カテゴリー別一覧が表示される
- [ ] 記事を作成できる
- [ ] 記事を編集できる
- [ ] 記事を削除できる
- [ ] カテゴリーを管理できる
- [ ] 公開/下書きステータスが切り替えられる

### 技術チェックリスト
- [ ] TypeScriptエラーがない（`npm run build`）
- [ ] ESLintエラーがない（`npm run lint`）
- [ ] Prismaスキーマが正しい
- [ ] APIエンドポイントがすべて動作する
- [ ] リレーションが正しく機能する
- [ ] バリデーションが適切に動作する

### UI/UXチェックリスト
- [ ] レスポンシブデザインが動作する
- [ ] shadcn/uiのスタイルが適用されている
- [ ] エラーメッセージが分かりやすい
- [ ] ローディング状態が表示される
- [ ] 削除確認ダイアログが表示される

---

## 💡 実装のヒント

### Prismaでのリレーションデータ取得
```typescript
// include: 関連データをすべて取得
const posts = await prisma.post.findMany({
  include: {
    category: true,
  },
});

// select: 特定のフィールドのみ取得（パフォーマンス最適化）
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    category: {
      select: {
        name: true,
        slug: true,
      },
    },
  },
});
```

### ページネーションの計算
```typescript
const page = Number(searchParams?.page) || 1;
const limit = 10;
const skip = (page - 1) * limit;

const [posts, totalCount] = await Promise.all([
  prisma.post.findMany({
    skip,
    take: limit,
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  }),
  prisma.post.count({ where: { published: true } }),
]);

const totalPages = Math.ceil(totalCount / limit);
```

### Slugの自動生成
```typescript
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

### Next.js 15のparamsハンドリング
```typescript
// 記事詳細ページ
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // awaitが必要
  // ...
}
```

---

## 🎉 完成おめでとうございます！

### 習得したスキル

✅ Dynamic Routes（`[slug]`パターン）
✅ Prismaの1対多リレーション
✅ `include`と`select`の使い分け
✅ ページネーション実装
✅ Zodバリデーション
✅ shadcn/uiの活用
✅ 管理画面の設計パターン
✅ より複雑なAPI設計
✅ Next.js 15の新機能（async params）

---

## 🚀 次のステップ

次は**アプリ3: 認証付きTODOアプリ**を作成します！
NextAuth.js v5を使って、ユーザー認証を学びましょう。

**準備ができたら、次のアプリに進みましょう！** 🎯
