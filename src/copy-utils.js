export const MENU_TO_MODE = {
  'copy-markdown': 'markdown',
  'copy-slack': 'slack',
  'copy-plain': 'plain',
};

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatLink({ mode, text, url }) {
  const label = (text || '').trim() || url;
  switch (mode) {
    case 'slack':
      return `<a href="${escapeHtml(url)}">${escapeHtml(label)}</a>`;
    case 'plain':
      return `${label} - ${url}`;
    case 'markdown':
    default:
      return `[${label}](${url})`;
  }
}

export function isRichTextMode(mode) {
  return mode === 'slack';
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
