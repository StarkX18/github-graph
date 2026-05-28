import { formatMetricLabel } from "../../utils/format.js";
import "./MetricTabs.css";

export function MetricTabs({ metricKeys, selectedMetric, onMetricChange }) {
  return (
    <div className="metric-tabs" role="tablist" aria-label="Activity metrics">
      {metricKeys.map((metricKey) => (
        <button
          type="button"
          className={`metric-tabs__button${selectedMetric === metricKey ? " metric-tabs__button--active" : ""}`}
          key={metricKey}
          role="tab"
          aria-selected={selectedMetric === metricKey}
          onClick={() => onMetricChange(metricKey)}
        >
          {formatMetricLabel(metricKey)}
        </button>
      ))}
    </div>
  );
}
