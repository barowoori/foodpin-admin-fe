function twoDigits(value: string) {
  return value.padStart(2, "0");
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const normalized = value.trim();
  const match = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):(\d{2})/,
  );

  if (match) {
    const [, year, month, day, hour, minute, second] = match;
    return `${year}.${twoDigits(month)}.${twoDigits(day)}\n${twoDigits(hour)}:${twoDigits(minute)}:${twoDigits(second)}`;
  }

  const dateOnlyMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return `${year}.${twoDigits(month)}.${twoDigits(day)}`;
  }

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return normalized;
  }

  const year = String(date.getFullYear());
  const month = twoDigits(String(date.getMonth() + 1));
  const day = twoDigits(String(date.getDate()));
  const hour = twoDigits(String(date.getHours()));
  const minute = twoDigits(String(date.getMinutes()));
  const second = twoDigits(String(date.getSeconds()));

  return `${year}.${month}.${day}\n${hour}:${minute}:${second}`;
}
