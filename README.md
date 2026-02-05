# Copy Link As (Chrome Extension)

選択テキストまたはページタイトル + URL を、以下の形式でコピーする Chrome 拡張です。

- Markdown: `[text](url)`
- Slack: `<url|text>`
- Plain: `text - url`

## 使い方

1. `chrome://extensions` を開く
2. デベロッパーモードを ON
3. 「パッケージ化されていない拡張機能を読み込む」でこのフォルダを選択
4. 任意のページで
   - 右クリック -> `Copy Link As` -> 形式を選択
   - もしくはショートカット `Cmd+Shift+C`（Mac）/`Ctrl+Shift+C`（Windows/Linux）

## 挙動

- テキスト選択中: 選択テキストをリンク文字列に使う
- 未選択: ページタイトルをリンク文字列に使う
- リンク上で右クリック: リンク先URLを使う

## 設定

拡張の「オプション」画面で Quick Copy の既定フォーマットを選択できます。

## テスト

```bash
npm test
```
