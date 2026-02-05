export const MENU_TO_MODE = {
  'copy-markdown': 'markdown',
  'copy-slack': 'slack',
  'copy-plain': 'plain',
};

export function formatLink({ mode, text, url }) {
  const label = (text || '').trim() || url;
  switch (mode) {
    case 'slack':
      return `<${url}|${label}>`;
    case 'plain':
      return `${label} - ${url}`;
    case 'markdown':
    default:
      return `[${label}](${url})`;
  }
}

export function resolveMode(menuItemId, defaultMode) {
  return MENU_TO_MODE[menuItemId] || defaultMode;
}

export function resolveText(info = {}, pageState = {}) {
  return (
    (info.selectionText || '').trim() ||
    pageState.selection ||
    pageState.title ||
    pageState.url
  );
}

export function resolveUrl(info = {}, pageState = {}) {
  return info.linkUrl || info.pageUrl || pageState.url;
}
