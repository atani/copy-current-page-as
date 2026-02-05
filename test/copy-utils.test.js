import test from 'node:test';
import assert from 'node:assert/strict';
import { formatLink, isRichTextMode, resolveMode, resolveText, resolveUrl } from '../src/copy-utils.js';

test('formatLink outputs markdown by default mode', () => {
  const value = formatLink({
    mode: 'markdown',
    text: 'Example',
    url: 'https://example.com',
  });
  assert.equal(value, '[Example](https://example.com)');
});

test('formatLink outputs slack format as HTML anchor', () => {
  const value = formatLink({
    mode: 'slack',
    text: 'Example',
    url: 'https://example.com',
  });
  assert.equal(value, '<a href="https://example.com">Example</a>');
});

test('formatLink escapes HTML special characters in slack format', () => {
  const value = formatLink({
    mode: 'slack',
    text: 'Test <script> & "quotes"',
    url: 'https://example.com?a=1&b=2',
  });
  assert.equal(value, '<a href="https://example.com?a=1&amp;b=2">Test &lt;script&gt; &amp; &quot;quotes&quot;</a>');
});

test('isRichTextMode returns true for slack mode', () => {
  assert.equal(isRichTextMode('slack'), true);
  assert.equal(isRichTextMode('markdown'), false);
  assert.equal(isRichTextMode('plain'), false);
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
