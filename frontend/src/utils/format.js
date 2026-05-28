import { METRIC_LABELS, METRIC_SINGULAR_LABELS } from "../data/metrics.js";

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatMetricLabel(metricKey) {
  return METRIC_LABELS[metricKey] || metricKey.replace(/[-_]/g, " ");
}

export function formatSingularMetricLabel(metricKey) {
  return METRIC_SINGULAR_LABELS[metricKey] || formatMetricLabel(metricKey).toLowerCase();
}
