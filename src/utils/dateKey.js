// Calendar-day keys in the user's LOCAL time zone (YYYY-MM-DD). Never use toISOString() for a
// "today" key: that's UTC, which moves the day boundary to 1am in UK summer time and to the
// evening in the US.
export function localDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Local key for `n` days before `d` (handles DST days that aren't 24h long).
export function localDateKeyDaysAgo(n, d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() - n);
  return localDateKey(x);
}
