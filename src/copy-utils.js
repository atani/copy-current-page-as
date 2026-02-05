export const MENU_TO_MODE = {
  'copy-url': 'url',
  'copy-markdown': 'markdown',
  'copy-slack': 'slack',
  'copy-plain': 'plain',
};

export function formatLink({ mode, text, url }) {
  const label = (text || '').trim() || url;
  switch (mode) {
    case 'url':
      return url;
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
  return pageState.title || pageState.url;
}

export function resolveUrl(info = {}, pageState = {}) {
  return pageState.url;
}
