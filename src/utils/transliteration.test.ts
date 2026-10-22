import test from 'node:test';
import assert from 'node:assert/strict';
import {
  phoneticTransliterate,
  getArabicCandidates,
  removeTashkeel,
  getArabicTextStats,
} from './transliteration.ts';

test('Arabizi transliteration converts common dictionary words', () => {
  const resultSalam = getArabicCandidates('salam');
  assert.equal(resultSalam.primary, 'سلام');

  const resultMarhaba = getArabicCandidates('marhaba');
  assert.equal(resultMarhaba.primary, 'مرحبا');

  const resultInshallah = getArabicCandidates('inshallah');
  assert.equal(resultInshallah.primary, 'إن شاء الله');
});

test('Arabizi numbers are mapped correctly to Arabic phonemes', () => {
  // 3 -> ع (Ain)
  const result3arab = getArabicCandidates('3arab');
  assert.equal(result3arab.primary, 'عرب');

  // 7 -> ح (Haa)
  const result7alwa = phoneticTransliterate('7alwa');
  assert.ok(result7alwa.includes('ح'));

  // 5 / kh -> خ (Kha)
  const resultKhobz = phoneticTransliterate('khobz');
  assert.ok(resultKhobz.includes('خ'));

  // 2 -> ء or أ
  const result2akbar = phoneticTransliterate('2akbar');
  assert.ok(result2akbar.startsWith('أ'));
});

test('removeTashkeel strips diacritics while preserving letters', () => {
  const withHarakat = 'مَرْحَبًا بِكُمْ';
  const clean = removeTashkeel(withHarakat);
  assert.equal(clean, 'مرحبا بكم');
});

test('getArabicTextStats calculates accurate metrics', () => {
  const sample = 'مَرْحَبًا بِكُمْ فِي العَالَمِ';
  const stats = getArabicTextStats(sample);
  assert.equal(stats.words, 4);
  assert.ok(stats.harakatCount > 0);
  assert.ok(stats.characters > stats.charsNoSpaces);
});
