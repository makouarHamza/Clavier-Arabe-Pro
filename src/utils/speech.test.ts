import test from 'node:test';
import assert from 'node:assert/strict';
import { getFallbackTtsUrl } from './speech.ts';

test('getFallbackTtsUrl constructs valid encoded Google Arabic TTS stream URL', () => {
  const url = getFallbackTtsUrl('مرحبا بك');
  assert.ok(url.startsWith('https://translate.google.com/translate_tts'));
  assert.ok(url.includes('tl=ar'));
  assert.ok(url.includes(encodeURIComponent('مرحبا بك')));
});

test('getFallbackTtsUrl limits long queries gracefully', () => {
  const longText = 'كلمة '.repeat(60);
  const url = getFallbackTtsUrl(longText);
  assert.ok(url.length > 0);
  assert.ok(url.includes('tl=ar'));
});
