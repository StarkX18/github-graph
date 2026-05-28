# GitHub-Style Multi-Metric Contribution Graph

A modular React frontend for a GitHub-like activity heatmap. The graph supports multiple metric keys, so the same UI can show `contributions`, `commits`, `problems`, or any other numeric daily metric the backend returns later.

## Folder Layout

```text
build/github-graph/
  frontend/
    index.html
    package.json
    vite.config.js
    src/
      App.jsx
      main.jsx
      components/
      data/
      styles/
      utils/
  backend/
```

## Run the Frontend

From `build/github-graph/frontend`:

```bash
npm install
npm run dev
```

Vite will print the local URL, usually:

```text
http://localhost:5173
```

Build for production with:

```bash
npm run build
```

## React Pieces

- `src/App.jsx`: owns selected metric state and passes data into the graph.
- `src/components/ContributionGraph`: renders the activity panel, calendar grid, month labels, weekday labels, and cells.
- `src/components/MetricTabs`: switches between metric keys.
- `src/components/Legend`: renders the Less/More intensity legend.
- `src/components/Tooltip`: renders the GitHub-like hover tooltip.
- `src/data/mockActivity.js`: generates local mock data.
- `src/utils`: contains date helpers, metric formatting, graph calculations, and default-zero metric access.

## Data Shape

Each day uses this shape:

```js
{
  date: "2026-05-28",
  metrics: {
    contributions: 4,
    commits: 2,
    problems: 1
  }
}
```

Missing metric values default to `0`, so this is valid:

```js
{
  date: "2026-05-28",
  metrics: {
    contributions: 4
  }
}
```

The current frontend generates mock data in this shape. A few generated days intentionally omit a metric so the zero-default behavior is exercised.

## Future Backend Contract

When the backend is ready, return an array of daily objects:

```json
[
  {
    "date": "2026-05-28",
    "metrics": {
      "contributions": 4,
      "commits": 2,
      "problems": 1
    }
  }
]
```

Then replace the mock data in `src/App.jsx` with backend-loaded state. The graph component is already shaped for this:

```jsx
<ContributionGraph
  days={days}
  metricKeys={["contributions", "commits", "problems"]}
  selectedMetric={selectedMetric}
  onMetricChange={setSelectedMetric}
/>
```

## Notes

- Color intensity is calculated per selected metric.
- Tabs control totals, tooltips, cell values, and color scaling.
- Real GitHub/API integration is intentionally left for the backend phase.
