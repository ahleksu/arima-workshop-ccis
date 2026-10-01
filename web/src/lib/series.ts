/** Loading and checking the bundled weekly series. */

export const SUPPORTED_SCHEMA_VERSION = 1;

export interface WeeklySeries {
  schema_version: number;
  source: string;
  freq: string;
  dates: string[];
  values: number[];
}

export type SeriesResult = { ok: true; series: WeeklySeries } | { ok: false; message: string };

/** Check parsed JSON. Returns a plain message instead of throwing. */
export function validateSeries(raw: unknown): SeriesResult {
  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, message: 'The bundled series file is not a JSON object. The ARIMA demo is turned off. The other demos still work.' };
  }
  const obj = raw as Record<string, unknown>;
  if (obj.schema_version !== SUPPORTED_SCHEMA_VERSION) {
    return {
      ok: false,
      message: `The bundled series file has schema version ${String(obj.schema_version)}. This page understands version ${SUPPORTED_SCHEMA_VERSION} only. The ARIMA demo is turned off. The other demos still work.`,
    };
  }
  const { dates, values } = obj;
  const good =
    Array.isArray(dates) &&
    Array.isArray(values) &&
    dates.length === values.length &&
    values.length >= 120 &&
    dates.every((d) => typeof d === 'string') &&
    values.every((v) => typeof v === 'number' && Number.isFinite(v));
  if (!good) {
    return {
      ok: false,
      message: 'The bundled series file is incomplete or has bad values. The ARIMA demo is turned off. The other demos still work.',
    };
  }
  return {
    ok: true,
    series: {
      schema_version: SUPPORTED_SCHEMA_VERSION,
      source: String(obj.source),
      freq: String(obj.freq),
      dates: dates as string[],
      values: values as number[],
    },
  };
}

/** Fetch the series from this site. */
export async function loadSeries(): Promise<SeriesResult> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/weekly_demand.json`);
    if (!response.ok) {
      return { ok: false, message: `The bundled series file did not load (status ${response.status}). The ARIMA demo is turned off. The other demos still work.` };
    }
    return validateSeries(await response.json());
  } catch {
    return { ok: false, message: 'The bundled series file did not load. The ARIMA demo is turned off. The other demos still work.' };
  }
}

/** Add days to an ISO date (YYYY-MM-DD) and return an ISO date. */
export function addDays(iso: string, days: number): string {
  const t = Date.parse(`${iso}T00:00:00Z`) + days * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}
