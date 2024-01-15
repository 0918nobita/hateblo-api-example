# Node.js から「はてなブログ AtomPub API」を利用して記事を管理するサンプル

## 環境変数の設定

`.envrc` に以下のように記述してください。

```
export HATENA_ID="...(はてなID)..."
export HATENA_DOMAIN="...(はてなブログのドメイン)..."
export HATENA_API_KEY="...(はてなブログのAPIキー)..."
```

## 依存パッケージのインストール

```bash
pnpm i
```

## コンパイル

```bash
pnpm tsc
```

## 実行

```bash
node dist/index.js
```
