/** Remember the last lecture beat, so the home page can mark where you stopped. */
const KEY = 'arima.lastBeat';

export function getLastBeat(): number | null {
  try {
    const value = Number(localStorage.getItem(KEY));
    return Number.isInteger(value) && value >= 1 && value <= 7 ? value : null;
  } catch {
    return null;
  }
}

export function setLastBeat(number: number): void {
  try {
    localStorage.setItem(KEY, String(number));
  } catch {
    // Storage can be blocked. The flag is a convenience only.
  }
}
