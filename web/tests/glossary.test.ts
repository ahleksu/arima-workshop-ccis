import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { brokenLinks, filterTerms, GLOSSARY, slug, sortTerms } from '../src/lib/glossary';

describe('glossary data', () => {
  it('has schema version 1 and unique terms', () => {
    expect(GLOSSARY.schema_version).toBe(1);
    const names = GLOSSARY.terms.map((t) => t.term);
    expect(new Set(names).size).toBe(names.length);
  });

  it('has no empty definition and no broken see-also link', () => {
    expect(GLOSSARY.terms.every((t) => t.definition.trim() !== '')).toBe(true);
    expect(brokenLinks(GLOSSARY.terms)).toEqual([]);
  });

  it('gives each term a distinct slug', () => {
    const slugs = GLOSSARY.terms.map((t) => slug(t.term));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('glossary helpers', () => {
  it('sorts terms without regard to case', () => {
    const names = sortTerms(GLOSSARY.terms).map((t) => t.term);
    expect(names.indexOf('PACF')).toBeGreaterThan(names.indexOf('Overfitting'));
    expect(names.indexOf('Residuals')).toBeGreaterThan(names.indexOf('PACF'));
    expect(names[0]).toBe('ACF');
  });

  it('filters by name, full name, and definition, and keeps all for an empty query', () => {
    expect(filterTerms(GLOSSARY.terms, '').length).toBe(GLOSSARY.terms.length);
    expect(filterTerms(GLOSSARY.terms, 'akaike').map((t) => t.term)).toEqual(['AIC']);
    expect(filterTerms(GLOSSARY.terms, 'zzzz')).toEqual([]);
  });

  it('reports a broken link', () => {
    expect(brokenLinks([{ term: 'A', definition: 'x', see: ['B'] }])).toEqual(['A -> B']);
  });
});

describe('docs/glossary.md', () => {
  it('matches the generated output', () => {
    expect(() => execFileSync('node', ['scripts/export-glossary.mjs', '--check'], { stdio: 'pipe' })).not.toThrow();
  });
});
