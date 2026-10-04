import './Tooltip.css';

export function Tooltip({ tooltip }) {
  const entryCount = tooltip.entries?.length ?? 0;

  return (
    <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
      <div className="tooltip__value">
        {tooltip.value > 0 ? tooltip.value : 'No data'}
      </div>
      {entryCount > 1 && (
        <div className="tooltip__meta">{entryCount} entries</div>
      )}
      {tooltip.note && <div className="tooltip__note">{tooltip.note}</div>}
      <div className="tooltip__date">{tooltip.date}</div>
    </div>
  );
}
