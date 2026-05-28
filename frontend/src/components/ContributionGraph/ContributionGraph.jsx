import { useMemo, useState } from "react";
import { Legend } from "../Legend/Legend.jsx";
import { MetricTabs } from "../MetricTabs/MetricTabs.jsx";
import { Tooltip } from "../Tooltip/Tooltip.jsx";
import { ContributionCell } from "./ContributionCell.jsx";
import { MonthLabels } from "./MonthLabels.jsx";
import { WeekdayLabels } from "./WeekdayLabels.jsx";
import {
  buildGraphDays,
  buildMonthLabels,
  calculateScale,
  getMetricValue,
} from "../../utils/activity.js";
import { formatMetricLabel, formatNumber } from "../../utils/format.js";
import "./ContributionGraph.css";

export function ContributionGraph({ days, metricKeys, selectedMetric, onMetricChange }) {
  const graphDays = useMemo(() => buildGraphDays(days), [days]);
  const monthLabels = useMemo(() => buildMonthLabels(graphDays), [graphDays]);
  const scale = useMemo(() => calculateScale(graphDays, selectedMetric), [graphDays, selectedMetric]);
  const [tooltip, setTooltip] = useState(null);

  const total = graphDays.reduce((sum, day) => {
    if (day.isFuture) {
      return sum;
    }

    return sum + getMetricValue(day, selectedMetric);
  }, 0);

  const metricLabel = formatMetricLabel(selectedMetric).toLowerCase();

  return (
    <section className="activity-panel" aria-label="Activity graph">
      <div className="activity-panel__header">
        <div>
          <p className="activity-panel__summary">
            {formatNumber(total)} {metricLabel} in the last year
          </p>
          <p className="activity-panel__subtle">Showing {formatMetricLabel(selectedMetric)} by day</p>
        </div>

        <MetricTabs
          metricKeys={metricKeys}
          selectedMetric={selectedMetric}
          onMetricChange={onMetricChange}
        />
      </div>

      <div className="activity-panel__body">
        <div className="activity-panel__scroll">
          <div className="contribution-graph">
            <MonthLabels months={monthLabels} />
            <WeekdayLabels />

            <div
              className="contribution-graph__grid"
              role="grid"
              aria-label={`${formatMetricLabel(selectedMetric)} heatmap`}
            >
              {graphDays.map((day) => (
                <ContributionCell
                  day={day}
                  key={day.date}
                  metricKey={selectedMetric}
                  scale={scale}
                  onTooltipChange={setTooltip}
                  onTooltipHide={() => setTooltip(null)}
                />
              ))}
            </div>
          </div>
        </div>

        <Legend />
      </div>

      {tooltip && <Tooltip tooltip={tooltip} />}
    </section>
  );
}
