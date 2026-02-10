# Copy Current Page As (Chrome Extension)

A Chrome extension that copies the current page in one of these formats:

- Markdown: `[text](url)`
- Slack: rich text link (HTML anchor)
- Plain: `text - url`

## Usage

1. Install from Chrome Web Store
   - URL: (put your store URL here)
2. On any page:
   - Right click -> `Copy Current Page As` -> choose a format
   - Or use shortcut: `Cmd+Shift+C` (Mac) / `Ctrl+Shift+C` (Windows/Linux)

## Behavior

- Always uses the current page title as the link text
- Always uses the current page URL as the link target
- Does not depend on text selection or right-clicking on a link

## Settings

You can choose the default format for Quick Copy in the extension options page.

## Development

1. Install dependencies

```bash
npm install
```

2. Run tests

```bash
npm test
```

3. Load the extension locally
   - Open `chrome://extensions`
   - Enable Developer mode
   - Click "Load unpacked" and select this folder

## Support

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4aaa?logo=github)](https://github.com/sponsors/atani)
