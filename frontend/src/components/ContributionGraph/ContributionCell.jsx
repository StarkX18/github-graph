import { getIntensityLevel } from '../../utils/activity.js';
import { formatDate } from '../../utils/date.js';

export function ContributionCell({ day, scale, baseline, onTooltipChange, onTooltipHide, onClick }) {
  const level = getIntensityLevel(day.value, scale, baseline);
  const hasData = day.value > 0;
  const valueText = hasData ? `${day.value}` : 'No data';
  const ariaLabel = `${valueText} on ${formatDate(day.date)}`;

  function showTooltip(event) {
    if (day.isFuture) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const eventX = event.clientX || rect.left + rect.width / 2;
    const eventY = event.clientY || rect.top;
    const safeX = Math.min(window.innerWidth - 90, Math.max(90, eventX));

    onTooltipChange({
      x: safeX,
      y: eventY,
      value: day.value,
      note: day.note,
      entries: day.entries,
      date: formatDate(day.date),
    });
  }

  const classNames = [
    'contribution-cell',
    day.isFuture ? 'contribution-cell--future' : '',
    day.isToday ? 'contribution-cell--today' : '',
    onClick && !day.isFuture ? 'contribution-cell--clickable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classNames}
      data-level={level}
      aria-label={day.isFuture ? 'Future date' : ariaLabel}
      tabIndex={day.isFuture ? -1 : 0}
      onMouseEnter={showTooltip}
      onMouseMove={showTooltip}
      onMouseLeave={onTooltipHide}
      onFocus={showTooltip}
      onBlur={onTooltipHide}
      onClick={onClick && !day.isFuture ? onClick : undefined}
    />
  );
}
