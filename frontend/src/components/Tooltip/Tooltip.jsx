import { formatNumber } from "../../utils/format.js";
import "./Tooltip.css";

export function Tooltip({ tooltip }) {
  return (
    <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
      <div>
        {formatNumber(tooltip.count)} {tooltip.metricLabel}
      </div>
      <div className="tooltip__date">{tooltip.date}</div>
    </div>
  );
}
