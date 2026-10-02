/** The session clock. It counts up from the start of the hour and tells pages which stop is current. */
import { SESSION_MINUTES, type Stop } from './content';
import { formatClock, stopAt } from './lib/session';
import { h, icon } from './ui';

const KEY = 'arima.clock';

interface Saved {
  elapsedMs: number;
  runningSince: number | null;
}

export interface ClockSnapshot {
  elapsedMs: number;
  running: boolean;
  started: boolean;
  stop: Stop | null;
}

type Listener = (snapshot: ClockSnapshot) => void;

let state: Saved = { elapsedMs: 0, runningSince: null };
const listeners = new Set<Listener>();
let timer: number | null = null;

function load(): void {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Saved>;
      if (typeof parsed.elapsedMs === 'number' && Number.isFinite(parsed.elapsedMs) && parsed.elapsedMs >= 0) {
        state = {
          elapsedMs: parsed.elapsedMs,
          runningSince: typeof parsed.runningSince === 'number' && Number.isFinite(parsed.runningSince) ? parsed.runningSince : null,
        };
      }
    }
  } catch {
    // Storage can be blocked. The clock still works for this visit.
  }
}

function save(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage can be blocked. Nothing else to do.
  }
}

function elapsed(): number {
  return state.elapsedMs + (state.runningSince === null ? 0 : Date.now() - state.runningSince);
}

export function snapshot(): ClockSnapshot {
  const ms = elapsed();
  const running = state.runningSince !== null;
  const started = running || state.elapsedMs > 0;
  return { elapsedMs: ms, running, started, stop: started ? stopAt(ms) : null };
}

function emit(): void {
  const snap = snapshot();
  for (const listener of listeners) {
    listener(snap);
  }
}

function schedule(): void {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
  if (state.runningSince !== null) {
    timer = window.setInterval(emit, 1000);
  }
}

export function subscribeClock(listener: Listener): () => void {
  listeners.add(listener);
  listener(snapshot());
  return () => listeners.delete(listener);
}

function start(): void {
  state = { elapsedMs: state.elapsedMs, runningSince: Date.now() };
  save();
  schedule();
  emit();
}

function pause(): void {
  state = { elapsedMs: elapsed(), runningSince: null };
  save();
  schedule();
  emit();
}

function reset(): void {
  state = { elapsedMs: 0, runningSince: null };
  save();
  schedule();
  emit();
}

/** Build the clock control for the header. Call once. */
export function mountClock(): HTMLElement {
  load();
  const time = h('span', { class: 'clock-time', role: 'timer', 'aria-label': 'Session time' }, '0:00');
  const now = h('span', { class: 'clock-now' });
  const toggle = h('button', { type: 'button', class: 'clock-btn' });
  const resetBtn = h('button', { type: 'button', class: 'clock-btn clock-reset', 'aria-label': 'Reset the clock to zero' }, icon('reset'), h('span', { class: 'btn-text' }, 'Reset'));
  const root = h('div', { class: 'clock', role: 'group', 'aria-label': 'Session clock' }, time, now, toggle, resetBtn);

  toggle.addEventListener('click', () => (snapshot().running ? pause() : start()));
  resetBtn.addEventListener('click', reset);

  subscribeClock((snap) => {
    time.textContent = formatClock(snap.elapsedMs);
    root.classList.toggle('is-idle', !snap.started);
    root.classList.toggle('is-running', snap.running);
    toggle.replaceChildren(icon(snap.running ? 'pause' : 'play'), h('span', { class: 'btn-text' }, snap.running ? 'Pause' : snap.started ? 'Resume' : 'Start clock'));
    toggle.setAttribute('aria-label', snap.running ? 'Pause the clock' : snap.started ? 'Resume the clock' : 'Start the session clock');
    resetBtn.hidden = !snap.started;
    time.hidden = !snap.started;
    now.hidden = !snap.started;
    if (snap.stop) {
      now.textContent = snap.stop.name;
    } else if (snap.started) {
      now.textContent = snap.elapsedMs / 60000 >= SESSION_MINUTES ? 'Past 60 minutes' : '';
    }
  });
  schedule();
  return root;
}
