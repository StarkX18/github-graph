import { addDays, endOfWeek, parseDateKey, startOfDay, toDateKey } from "./date.js";

export function getMetricValue(day, metricKey) {
  const rawValue = day.metrics && day.metrics[metricKey];
  const value = Number(rawValue);

  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

export function buildGraphDays(days) {
  const today = startOfDay(new Date());
  const gridEnd = endOfWeek(today);
  const gridStart = addDays(gridEnd, -370);
  const daysByDate = new Map(days.map((day) => [day.date, day]));

  return Array.from({ length: 371 }, (_, index) => {
    const date = addDays(gridStart, index);
    const dateKey = toDateKey(date);
    const day = daysByDate.get(dateKey) || { date: dateKey, metrics: {} };

    return {
      ...day,
      date: dateKey,
      metrics: day.metrics || {},
      isFuture: date > today,
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
      label: shouldShowLabel ? labelDate.toLocaleDateString("en-US", { month: "short" }) : "",
    };
  });
}

export function calculateScale(graphDays, metricKey) {
  const maxValue = graphDays.reduce((max, day) => {
    if (day.isFuture) {
      return max;
    }

    return Math.max(max, getMetricValue(day, metricKey));
  }, 0);

  if (maxValue === 0) {
    return [1, 2, 3];
  }

  return [
    Math.max(1, Math.ceil(maxValue * 0.25)),
    Math.max(1, Math.ceil(maxValue * 0.5)),
    Math.max(1, Math.floor(maxValue * 0.75)),
  ];
}

export function getIntensityLevel(value, scale) {
  if (value <= 0) {
    return 0;
  }

  if (value <= scale[0]) {
    return 1;
  }

  if (value <= scale[1]) {
    return 2;
  }

  if (value <= scale[2]) {
    return 3;
  }

  return 4;
}
