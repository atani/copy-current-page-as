import test from 'node:test';
import assert from 'node:assert/strict';
import { formatLink, resolveMode, resolveText, resolveUrl } from '../src/copy-utils.js';

test('formatLink outputs markdown by default mode', () => {
  const value = formatLink({
    mode: 'markdown',
    text: 'Example',
    url: 'https://example.com',
  });
  assert.equal(value, '[Example](https://example.com)');
});

test('formatLink outputs slack format', () => {
  const value = formatLink({
    mode: 'slack',
    text: 'Example',
    url: 'https://example.com',
  });
  assert.equal(value, '<https://example.com|Example>');
});

test('formatLink outputs plain format', () => {
  const value = formatLink({
    mode: 'plain',
    text: 'Example',
    url: 'https://example.com',
  });
  assert.equal(value, 'Example - https://example.com');
});

test('formatLink falls back to url when text is empty', () => {
  const value = formatLink({
    mode: 'markdown',
    text: '   ',
    url: 'https://example.com',
  });
  assert.equal(value, '[https://example.com](https://example.com)');
});

test('resolveMode maps known menu ids and falls back to default', () => {
  assert.equal(resolveMode('copy-markdown', 'slack'), 'markdown');
  assert.equal(resolveMode('copy-slack', 'markdown'), 'slack');
  assert.equal(resolveMode('copy-plain', 'markdown'), 'plain');
  assert.equal(resolveMode('copy-unknown', 'markdown'), 'markdown');
});

test('resolveText uses page title and falls back to page url', () => {
  assert.equal(
    resolveText({}, { title: 'Page Title', url: 'https://example.com' }),
    'Page Title',
  );
  assert.equal(
    resolveText({}, { title: '', url: 'https://example.com' }),
    'https://example.com',
  );
});

test('resolveUrl always uses current page url', () => {
  assert.equal(
    resolveUrl({ linkUrl: 'https://link.example', pageUrl: 'https://page.example' }, { url: 'https://current.example' }),
    'https://current.example',
  );
});
