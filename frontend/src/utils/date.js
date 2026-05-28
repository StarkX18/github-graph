function padNumber(value) {
  return String(value).padStart(2, "0");
}

export function toDateKey(date) {
  return [date.getFullYear(), padNumber(date.getMonth() + 1), padNumber(date.getDate())].join("-");
}

export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function startOfWeek(date) {
  const start = startOfDay(date);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

export function endOfWeek(date) {
  return addDays(startOfWeek(date), 6);
}

export function formatDate(dateKey) {
  return parseDateKey(dateKey).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
