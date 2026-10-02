/** Pure helpers for the session clock and the hash routes. No DOM access. */
import { SESSION_MINUTES, STOPS, type Stop } from '../content';

/** Find the stop that holds this elapsed time, or null before the start and after the end. */
export function stopAt(elapsedMs: number): Stop | null {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
    return null;
  }
  const minute = elapsedMs / 60000;
  if (minute >= SESSION_MINUTES) {
    return null;
  }
  return STOPS.find((s) => minute >= s.start && minute < s.end) ?? null;
}

/** Format milliseconds as m:ss, or mm:ss past 10 minutes. Negative and bad values show 0:00. */
export function formatClock(elapsedMs: number): string {
  const total = Number.isFinite(elapsedMs) && elapsedMs > 0 ? Math.floor(elapsedMs / 1000) : 0;
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export interface Route {
  page: 'home' | 'lecture' | 'hands-on' | 'demos' | 'glossary' | 'not-found';
  param: string | null;
}

/** Turn a hash such as "#/lecture/3" into a route. A bad chapter number gives not-found. */
export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/\/+$/, '');
  if (path === '' || path === '/') {
    return { page: 'home', param: null };
  }
  const [, first, second] = path.split('/');
  switch (first) {
    case 'lecture':
      if (second === undefined) return { page: 'lecture', param: '1' };
      return /^[1-4]$/.test(second) ? { page: 'lecture', param: second } : { page: 'not-found', param: null };
    case 'hands-on':
      if (second === undefined) return { page: 'hands-on', param: null };
      return ['setup', 'prepare', 'fit', 'forecast', 'recap'].includes(second) ? { page: 'hands-on', param: second } : { page: 'not-found', param: null };
    case 'demos':
      return second === undefined ? { page: 'demos', param: null } : { page: 'not-found', param: null };
    case 'glossary':
      if (second === undefined) return { page: 'glossary', param: null };
      return /^[a-z0-9-]+$/.test(second) ? { page: 'glossary', param: second } : { page: 'not-found', param: null };
    default:
      return { page: 'not-found', param: null };
  }
}
