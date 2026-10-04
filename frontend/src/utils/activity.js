import { addDays, endOfWeek, parseDateKey, startOfDay, toDateKey } from './date.js';

export function buildGraphDays(days) {
  const today = startOfDay(new Date());
  const todayKey = toDateKey(today);
  const gridEnd = endOfWeek(today);
  const gridStart = addDays(gridEnd, -370);
  const daysByDate = new Map(days.map((d) => [d.date, d]));

  return Array.from({ length: 371 }, (_, index) => {
    const date = addDays(gridStart, index);
    const dateKey = toDateKey(date);
    const day = daysByDate.get(dateKey);

    return {
      date: dateKey,
      value: day?.value ?? 0,
      note: day?.note ?? '',
      entries: day?.entries ?? [],
      isFuture: date > today,
      isToday: dateKey === todayKey,
    };
  });
}

export function buildMonthLabels(graphDays) {
  return Array.from({ length: 53 }, (_, weekIndex) => {
    const weekDays = graphDays.slice(weekIndex * 7, weekIndex * 7 + 7);
    const firstDayOfWeek = parseDateKey(weekDays[0].date);
    const firstOfMonth = weekDays.find((day) => {
      return !day.isFuture && parseDateKey(day.date).getDate() === 1;
    });
    const labelDate = firstOfMonth ? parseDateKey(firstOfMonth.date) : firstDayOfWeek;
    const shouldShowLabel = weekIndex === 0 || Boolean(firstOfMonth);

    return {
      weekIndex,
      label: shouldShowLabel ? labelDate.toLocaleDateString('en-US', { month: 'short' }) : '',
    };
  });
}

export function calculateScale(graphDays, baseline = 0) {
  const maxValue = graphDays.reduce((max, day) => {
    if (day.isFuture) return max;
    return Math.max(max, day.value);
  }, 0);

  if (maxValue <= baseline) {
    return [baseline + 1, baseline + 2, baseline + 3];
  }

  const range = maxValue - baseline;
  return [
    Math.max(baseline + 1, Math.ceil(baseline + range * 0.25)),
    Math.max(baseline + 1, Math.ceil(baseline + range * 0.5)),
    Math.max(baseline + 1, Math.floor(baseline + range * 0.75)),
  ];
}

export function getIntensityLevel(value, scale, baseline = 0) {
  if (value <= baseline) return 0;
  if (value <= scale[0]) return 1;
  if (value <= scale[1]) return 2;
  if (value <= scale[2]) return 3;
  return 4;
}
