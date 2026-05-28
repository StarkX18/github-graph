import { WEEKDAY_LABELS } from "../../data/metrics.js";

export function WeekdayLabels() {
  return (
    <div className="contribution-graph__weekday-labels" aria-hidden="true">
      {WEEKDAY_LABELS.map((label, index) => (
        <span key={index}>{label}</span>
      ))}
    </div>
  );
}
