import { getIntensityLevel, getMetricValue } from "../../utils/activity.js";
import { formatDate } from "../../utils/date.js";
import {
  formatMetricLabel,
  formatNumber,
  formatSingularMetricLabel,
} from "../../utils/format.js";

export function ContributionCell({ day, metricKey, scale, onTooltipChange, onTooltipHide }) {
  const value = getMetricValue(day, metricKey);
  const level = getIntensityLevel(value, scale);
  const metricLabel = formatMetricLabel(metricKey).toLowerCase();
  const valueLabel = value === 1 ? formatSingularMetricLabel(metricKey) : metricLabel;
  const ariaLabel = `${formatNumber(value)} ${valueLabel} on ${formatDate(day.date)}`;

  function showTooltip(event) {
    if (day.isFuture) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const eventX = event.clientX || rect.left + rect.width / 2;
    const eventY = event.clientY || rect.top;
    const safeX = Math.min(window.innerWidth - 90, Math.max(90, eventX));

    onTooltipChange({
      x: safeX,
      y: eventY,
      count: value,
      metricLabel: valueLabel,
      date: formatDate(day.date),
    });
  }

  return (
    <button
      type="button"
      className={`contribution-cell${day.isFuture ? " contribution-cell--future" : ""}`}
      data-level={level}
      aria-label={day.isFuture ? "Future date" : ariaLabel}
      tabIndex={day.isFuture ? -1 : 0}
      onMouseEnter={showTooltip}
      onMouseMove={showTooltip}
      onMouseLeave={onTooltipHide}
      onFocus={showTooltip}
      onBlur={onTooltipHide}
    />
  );
}
