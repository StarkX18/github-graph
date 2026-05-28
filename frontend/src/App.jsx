import { useMemo, useState } from "react";
import { ContributionGraph } from "./components/ContributionGraph/ContributionGraph.jsx";
import { generateMockDays } from "./data/mockActivity.js";
import { METRIC_KEYS } from "./data/metrics.js";

export default function App() {
  const [selectedMetric, setSelectedMetric] = useState(METRIC_KEYS[0]);
  const days = useMemo(() => generateMockDays(), []);

  return (
    <main className="page">
      <div className="app-shell">
        <h1 className="page-title">Contribution activity</h1>
        <ContributionGraph
          days={days}
          metricKeys={METRIC_KEYS}
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
        />
      </div>
    </main>
  );
}
