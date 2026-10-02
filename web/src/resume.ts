/** Remember the last lecture chapter, so the home page can mark where you stopped. */
const KEY = 'arima.lastChapter';
const CHAPTER_COUNT = 4;

export function getLastChapter(): number | null {
  try {
    const value = Number(localStorage.getItem(KEY));
    return Number.isInteger(value) && value >= 1 && value <= CHAPTER_COUNT ? value : null;
  } catch {
    return null;
  }
}

export function setLastChapter(number: number): void {
  try {
    localStorage.setItem(KEY, String(number));
  } catch {
    // Storage can be blocked. The flag is a convenience only.
  }
}
