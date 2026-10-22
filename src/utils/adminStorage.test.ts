import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEstimatedRevenue,
  calculateCtr,
  DEFAULT_ADMIN_SETTINGS,
} from './adminStorage.ts';

test('calculateEstimatedRevenue accurately accounts for CPM and CPC', () => {
  // 10,000 impressions at $2.00 eCPM = $20
  // 100 clicks at $0.10 CPC = $10
  // Total = $30.00
  const rev = calculateEstimatedRevenue(10000, 100, 2.0, 0.1);
  assert.equal(rev, 30.0);

  // 0 impressions & 0 clicks = 0
  const revZero = calculateEstimatedRevenue(0, 0);
  assert.equal(revZero, 0);
});

test('calculateCtr formats percentage correctly', () => {
  // 50 clicks out of 1000 impressions = 5.00%
  const ctr = calculateCtr(50, 1000);
  assert.equal(ctr, '5.00%');

  // Division by zero safeguard
  const ctrZero = calculateCtr(0, 0);
  assert.equal(ctrZero, '0.00%');
});

test('DEFAULT_ADMIN_SETTINGS includes all required ad slots and SEO defaults', () => {
  assert.ok(DEFAULT_ADMIN_SETTINGS.adUnits.leaderboard);
  assert.ok(DEFAULT_ADMIN_SETTINGS.adUnits.skyscraper);
  assert.ok(DEFAULT_ADMIN_SETTINGS.adUnits.native);
  assert.ok(DEFAULT_ADMIN_SETTINGS.seo.siteTitle.length > 0);
  assert.ok(DEFAULT_ADMIN_SETTINGS.customDictionary.length > 0);
});
