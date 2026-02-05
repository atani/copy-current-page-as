import { formatLink, resolveMode, resolveText, resolveUrl } from './copy-utils.js';
const MENU_ROOT = 'link-copy-formats';
const MENU_URL = 'copy-url';
const MENU_MARKDOWN = 'copy-markdown';
const MENU_SLACK = 'copy-slack';
const MENU_PLAIN = 'copy-plain';

const DEFAULT_SETTINGS = {
  defaultMode: 'markdown',
};

async function getSettings() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...settings };
}

async function createMenus() {
  await chrome.contextMenus.removeAll();
  const contexts = ['page', 'selection', 'link', 'editable', 'image', 'video', 'audio'];

  chrome.contextMenus.create({
    id: MENU_ROOT,
    title: 'Copy Current Page As',
    contexts,
  });

  chrome.contextMenus.create({
    id: MENU_URL,
    parentId: MENU_ROOT,
    title: 'Current Page URL',
    contexts,
  });

  chrome.contextMenus.create({
    id: MENU_MARKDOWN,
    parentId: MENU_ROOT,
    title: 'Markdown',
    contexts,
  });

  chrome.contextMenus.create({
    id: MENU_SLACK,
    parentId: MENU_ROOT,
    title: 'Slack',
    contexts,
  });

  chrome.contextMenus.create({
    id: MENU_PLAIN,
    parentId: MENU_ROOT,
    title: 'Plain',
    contexts,
  });
}

async function getPageState(tabId) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      return {
        title: document.title || '',
        url: window.location.href,
      };
    },
  });

  return result;
}

async function writeClipboard(tabId, text) {
  await chrome.scripting.executeScript({
    target: { tabId },
    args: [text],
    func: async (value) => {
      try {
        await navigator.clipboard.writeText(value);
        return;
      } catch (_) {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
    },
  });
}

async function showCopiedToast(tabId, mode) {
  const modeLabel =
    mode === 'url' ? 'URL' : mode === 'slack' ? 'Slack' : mode === 'plain' ? 'Plain' : 'Markdown';
  await chrome.scripting.executeScript({
    target: { tabId },
    args: [modeLabel],
    func: (label) => {
      const id = '__copy_current_page_as_toast__';
      const existing = document.getElementById(id);
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.id = id;
      toast.textContent = `Copied as ${label}`;
      toast.style.position = 'fixed';
      toast.style.top = '16px';
      toast.style.right = '16px';
      toast.style.zIndex = '2147483647';
      toast.style.padding = '10px 12px';
      toast.style.borderRadius = '10px';
      toast.style.background = 'rgba(20, 20, 20, 0.92)';
      toast.style.color = '#fff';
      toast.style.fontSize = '13px';
      toast.style.fontFamily = '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
      toast.style.boxShadow = '0 8px 20px rgba(0,0,0,.25)';
      toast.style.transition = 'opacity 180ms ease';
      toast.style.opacity = '1';
      document.documentElement.appendChild(toast);

      window.setTimeout(() => {
        toast.style.opacity = '0';
      }, 1100);
      window.setTimeout(() => {
        toast.remove();
      }, 1300);
    },
  });
}

async function copyFromTab(tabId, mode, info = {}) {
  if (!tabId) return;

  const pageState = await getPageState(tabId);
  const text = resolveText(info, pageState);
  const url = resolveUrl(info, pageState);
  const formatted = formatLink({ mode, text, url });

  await writeClipboard(tabId, formatted);
  await showCopiedToast(tabId, mode);
}

chrome.runtime.onInstalled.addListener(async () => {
  await createMenus();
});

chrome.runtime.onStartup.addListener(async () => {
  await createMenus();
});

createMenus().catch((error) => {
  console.error('Failed to initialize context menus:', error);
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  const settings = await getSettings();
  const mode = resolveMode(info.menuItemId, settings.defaultMode);

  try {
    await copyFromTab(tab.id, mode, info);
  } catch (error) {
    console.error('Copy failed:', error);
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'quick-copy-current-page') return;

  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) return;

  const settings = await getSettings();

  try {
    await copyFromTab(tab.id, settings.defaultMode);
  } catch (error) {
    console.error('Quick copy failed:', error);
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;
  const settings = await getSettings();

  try {
    await copyFromTab(tab.id, settings.defaultMode);
  } catch (error) {
    console.error('Action click copy failed:', error);
  }
});
