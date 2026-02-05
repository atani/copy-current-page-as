import { formatLink, resolveMode, resolveText, resolveUrl } from './copy-utils.js';
const MENU_ROOT = 'link-copy-formats';
const MENU_QUICK = 'copy-quick';
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

  chrome.contextMenus.create({
    id: MENU_ROOT,
    title: 'Copy Link As',
    contexts: ['page', 'selection', 'link'],
  });

  chrome.contextMenus.create({
    id: MENU_QUICK,
    parentId: MENU_ROOT,
    title: 'Quick Copy (Default)',
    contexts: ['page', 'selection', 'link'],
  });

  chrome.contextMenus.create({
    id: MENU_MARKDOWN,
    parentId: MENU_ROOT,
    title: 'Markdown',
    contexts: ['page', 'selection', 'link'],
  });

  chrome.contextMenus.create({
    id: MENU_SLACK,
    parentId: MENU_ROOT,
    title: 'Slack',
    contexts: ['page', 'selection', 'link'],
  });

  chrome.contextMenus.create({
    id: MENU_PLAIN,
    parentId: MENU_ROOT,
    title: 'Plain',
    contexts: ['page', 'selection', 'link'],
  });
}

async function getPageState(tabId) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const selected = window.getSelection()?.toString().trim() || '';
      return {
        title: document.title || '',
        selection: selected,
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

async function copyFromTab(tabId, mode, info = {}) {
  if (!tabId) return;

  const pageState = await getPageState(tabId);
  const text = resolveText(info, pageState);
  const url = resolveUrl(info, pageState);
  const formatted = formatLink({ mode, text, url });

  await writeClipboard(tabId, formatted);
}

chrome.runtime.onInstalled.addListener(async () => {
  await createMenus();
});

chrome.runtime.onStartup.addListener(async () => {
  await createMenus();
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
  if (command !== 'quick-copy-link') return;

  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) return;

  const settings = await getSettings();

  try {
    await copyFromTab(tab.id, settings.defaultMode);
  } catch (error) {
    console.error('Quick copy failed:', error);
  }
});
