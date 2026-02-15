# Chrome Web Store アセット

このディレクトリには Chrome Web Store 申請に使用したアセットが含まれています。

## ファイル構成

```
store-assets/
├── store-listing.json          # ストア掲載情報
├── store-listing.template.json # テンプレート
├── store-listing.schema.json   # JSONスキーマ
├── screenshots/                # スクリーンショット
└── promo/                      # プロモーション画像
```

## 申請ツール

申請自動化ツールは別リポジトリに移動しました:

```bash
# グローバルインストール
cd ../cws-submit && npm link

# 使い方
cws-submit           # このプロジェクトで申請
cws-submit --init    # 新規プロジェクトの初期化
```
