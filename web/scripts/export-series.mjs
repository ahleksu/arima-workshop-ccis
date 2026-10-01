// Build step: read the daily energy demand CSV and write a weekly mean series as JSON.
// Weeks start on Monday. A week with fewer than 7 daily rows is dropped.
// Usage: node scripts/export-series.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const csvPath = resolve(here, '../../data/energy_demand_daily.csv');
const outPath = resolve(here, '../public/data/weekly_demand.json');

function fail(message) {
  console.error(`export-series: ${message}`);
  process.exit(1);
}

let text;
try {
  text = readFileSync(csvPath, 'utf8');
} catch {
  fail(`cannot read ${csvPath}`);
}

const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
const header = lines[0].split(',').map((s) => s.trim());
const iDate = header.indexOf('date');
const iDemand = header.indexOf('demand_gwh');
if (iDate < 0 || iDemand < 0) {
  fail('the CSV header must contain the columns date and demand_gwh');
}

const MS_PER_DAY = 86_400_000;

function mondayOf(isoDate) {
  const t = Date.parse(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(t)) {
    fail(`bad date: ${isoDate}`);
  }
  const dow = new Date(t).getUTCDay(); // 0 = Sunday
  const back = (dow + 6) % 7; // days since Monday
  return new Date(t - back * MS_PER_DAY).toISOString().slice(0, 10);
}

const weeks = new Map(); // monday ISO date -> { sum, count }
for (let i = 1; i < lines.length; i += 1) {
  const cells = lines[i].split(',');
  const value = Number(cells[iDemand]);
  if (!Number.isFinite(value)) {
    fail(`bad demand value on line ${i + 1}`);
  }
  const key = mondayOf(cells[iDate].trim());
  const slot = weeks.get(key) ?? { sum: 0, count: 0 };
  slot.sum += value;
  slot.count += 1;
  weeks.set(key, slot);
}

const dates = [];
const values = [];
for (const key of [...weeks.keys()].sort()) {
  const { sum, count } = weeks.get(key);
  if (count === 7) {
    dates.push(key);
    values.push(Math.round((sum / count) * 1000) / 1000);
  }
}
if (values.length < 120) {
  fail(`only ${values.length} complete weeks found`);
}

const payload = {
  schema_version: 1,
  source: 'synthetic',
  freq: 'W-MON',
  dates,
  values,
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(payload)}\n`);
console.log(`export-series: wrote ${values.length} weekly values (${dates[0]} to ${dates[dates.length - 1]})`);
