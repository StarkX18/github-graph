import { addDays, endOfWeek, startOfDay, toDateKey } from "../utils/date.js";

function seededNoise(input) {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return ((hash >>> 0) % 1000) / 1000;
}

export function generateMockDays() {
  const today = startOfDay(new Date());
  const gridEnd = endOfWeek(today);
  const gridStart = addDays(gridEnd, -370);
  const days = [];

  for (let index = 0; index < 371; index += 1) {
    const date = addDays(gridStart, index);
    const dateKey = toDateKey(date);
    const isFuture = date > today;
    const weekday = date.getDay();
    const isWeekday = weekday > 0 && weekday < 6;
    const season = 0.65 + Math.sin((index / 371) * Math.PI * 2 + 0.8) * 0.35;
    const metrics = {};

    if (!isFuture) {
      const contributionNoise = seededNoise(`${dateKey}:contributions`);
      const commitNoise = seededNoise(`${dateKey}:commits`);
      const problemNoise = seededNoise(`${dateKey}:problems`);

      metrics.contributions =
        contributionNoise < 0.18
          ? 0
          : Math.floor((contributionNoise * 9 + season * 5) * (isWeekday ? 1 : 0.45));

      metrics.commits =
        commitNoise < 0.28
          ? 0
          : Math.floor((commitNoise * 5 + season * 3) * (isWeekday ? 1 : 0.35));

      metrics.problems =
        problemNoise < 0.62
          ? 0
          : Math.max(1, Math.floor(problemNoise * 4 * (isWeekday ? 1 : 0.6)));

      if (index % 47 === 0) {
        delete metrics.problems;
      }

      if (index % 89 === 0) {
        delete metrics.commits;
      }
    }

    days.push({
      date: dateKey,
      metrics,
    });
  }

  return days;
}
