import { useMemo, useState } from 'react';
import { Tooltip } from '../Tooltip/Tooltip.jsx';
import { ContributionCell } from './ContributionCell.jsx';
import { MonthLabels } from './MonthLabels.jsx';
import { WeekdayLabels } from './WeekdayLabels.jsx';
import { buildGraphDays, buildMonthLabels, calculateScale } from '../../utils/activity.js';
import './ContributionGraph.css';

export function ContributionGraph({ days, baseline = 0, colors, onCellClick }) {
  const graphDays = useMemo(() => buildGraphDays(days), [days]);
  const monthLabels = useMemo(() => buildMonthLabels(graphDays), [graphDays]);
  const scale = useMemo(() => calculateScale(graphDays, baseline), [graphDays, baseline]);
  const [tooltip, setTooltip] = useState(null);

  const colorVars = colors
    ? { '--level-1': colors[1], '--level-2': colors[2], '--level-3': colors[3], '--level-4': colors[4] }
    : {};

  return (
    <div className="contribution-graph-wrap">
      <div className="activity-panel__scroll">
        <div className="contribution-graph" style={colorVars}>
          <MonthLabels months={monthLabels} />
          <WeekdayLabels />
          <div
            className="contribution-graph__grid"
            role="grid"
            aria-label="Activity heatmap"
          >
            {graphDays.map((day) => (
              <ContributionCell
                day={day}
                key={day.date}
                scale={scale}
                baseline={baseline}
                onTooltipChange={setTooltip}
                onTooltipHide={() => setTooltip(null)}
                onClick={onCellClick ? () => onCellClick(day) : undefined}
              />
            ))}
          </div>
        </div>
      </div>
      {tooltip && <Tooltip tooltip={tooltip} />}
    </div>
  );
}
