# Copy Link As (Chrome Extension)

現在開いているページのタイトル + URL を、以下の形式でコピーする Chrome 拡張です。

- Markdown: `[text](url)`
- Slack: `<url|text>`
- Plain: `text - url`

## 使い方

1. Chrome Web Store から拡張をインストール
   - URL: （ここにストアURLを貼る）
2. 任意のページで
   - 右クリック -> `Copy Link As` -> 形式を選択
   - もしくはショートカット `Cmd+Shift+C`（Mac）/`Ctrl+Shift+C`（Windows/Linux）

## 挙動

- 常に「現在のページタイトル」をリンク文字列に使う
- 常に「現在のページURL」をリンク先に使う
- テキスト選択やリンク上クリックの有無には依存しない

## 設定

拡張の「オプション」画面で Quick Copy の既定フォーマットを選択できます。

## テスト

```bash
npm test
```

## 開発の仕方

1. 依存をインストール

```bash
npm install
```

2. テストを実行

```bash
npm test
```

3. 拡張をローカルで読み込む
   - `chrome://extensions` を開く
   - デベロッパーモードを ON
   - 「パッケージ化されていない拡張機能を読み込む」でこのフォルダを選択
