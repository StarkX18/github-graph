import { LEVEL_COLORS } from "../../data/metrics.js";
import "./Legend.css";

export function Legend() {
  return (
    <div className="legend" aria-label="Contribution intensity legend">
      <span>Less</span>
      <span className="legend__cells" aria-hidden="true">
        {LEVEL_COLORS.map((color, index) => (
          <span className="legend__cell" key={color} style={{ background: color }} title={`Level ${index}`} />
        ))}
      </span>
      <span>More</span>
    </div>
  );
}
