import data from '../glossary.json';

export interface GlossaryTerm {
  term: string;
  full?: string;
  definition: string;
  see: string[];
}

export interface GlossaryData {
  schema_version: number;
  terms: GlossaryTerm[];
}

export const GLOSSARY = data as GlossaryData;

export function slug(term: string): string {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function sortTerms(terms: readonly GlossaryTerm[]): GlossaryTerm[] {
  return [...terms].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));
}

/** Keep the terms whose name, full name, or definition contains the query. An empty query keeps all. */
export function filterTerms(terms: readonly GlossaryTerm[], query: string): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  if (q === '') {
    return [...terms];
  }
  return terms.filter((t) => `${t.term} ${t.full ?? ''} ${t.definition}`.toLowerCase().includes(q));
}

/** Return every "see also" name that has no matching term. */
export function brokenLinks(terms: readonly GlossaryTerm[]): string[] {
  const names = new Set(terms.map((t) => t.term));
  return terms.flatMap((t) => t.see.filter((s) => !names.has(s)).map((s) => `${t.term} -> ${s}`));
}
