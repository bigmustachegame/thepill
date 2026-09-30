const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const locales = ['en', 'tr', 'fr', 'es', 'ru', 'de'];
const catalog = require('../src/data/capsules.catalog.json');
assert.deepEqual(catalog, require('../capsules.catalog.json'), 'Catalog copies must agree');
assert.equal(catalog.capsules.length, 96);
assert.equal(new Set(catalog.capsules.map(c => c.code)).size, 96);
const base = require('../src/i18n/locales/en.json');
const placeholders = s => (s.match(/\{\w+\}/g) ?? []).sort();
for (const locale of locales) {
  const dictionary = require(`../src/i18n/locales/${locale}.json`);
  assert.deepEqual(Object.keys(dictionary).sort(), Object.keys(base).sort(), `${locale}: missing keys`);
  for (const [key, value] of Object.entries(dictionary)) {
    assert.ok(value.trim(), `${locale}.${key} is empty`);
    assert.deepEqual(placeholders(value), placeholders(base[key]), `${locale}.${key}: interpolation mismatch`);
  }
  const names = [];
  for (const capsule of catalog.capsules) {
    const copy = capsule.translations[locale];
    assert.ok(copy?.name && copy?.description.trim() && copy.description.length <= 320, `${locale}.${capsule.code}: incomplete copy`);
    assert.equal(copy.name, capsule.name, `${locale}.${capsule.code}: display name mismatch`);
    names.push(copy.name);
  }
  assert.equal(new Set(names).size, 96, `${locale}: duplicate capsule names`);
}
for (const capsule of catalog.capsules) {
  assert.ok(fs.existsSync(path.join(__dirname, '../Binaural beats', capsule.file)), `Missing audio: ${capsule.file}`);
  assert.equal(capsule.name, capsule.translations.en.name);
  assert.equal(capsule.description, capsule.translations.en.description);
  assert.equal(capsule.descriptionTr, capsule.translations.tr.description);
}
assert.equal(catalog.capsules.filter(c => c.free).length, 3);
for (const c of catalog.capsules.filter(c => c.state === 'PRO')) assert.ok(c.pro && !c.free);
console.log(`Verified ${Object.keys(base).length} UI keys × 6 languages, 96 localized capsules, unique names, audio paths and access flags.`);
