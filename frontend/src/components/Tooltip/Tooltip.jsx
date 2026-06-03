import './Tooltip.css';

export function Tooltip({ tooltip }) {
  return (
    <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
      <div className="tooltip__value">
        {tooltip.value > 0 ? tooltip.value : 'No data'}
      </div>
      {tooltip.note && <div className="tooltip__note">{tooltip.note}</div>}
      <div className="tooltip__date">{tooltip.date}</div>
    </div>
  );
}
