export function MonthLabels({ months }) {
  return (
    <div className="contribution-graph__month-labels" aria-hidden="true">
      {months.map((month) => (
        <span className="contribution-graph__month-label" key={month.weekIndex}>
          {month.label}
        </span>
      ))}
    </div>
  );
}
