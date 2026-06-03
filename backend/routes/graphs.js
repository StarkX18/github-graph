const express = require('express');
const { load, save, newId } = require('../db');

const router = express.Router();

router.get('/domain/:domainId', (req, res) => {
  const { graphs } = load();
  const result = graphs
    .filter((g) => g.domainId === req.params.domainId)
    .sort((a, b) => a.position - b.position || a.createdAt.localeCompare(b.createdAt));
  res.json(result);
});

router.post('/domain/:domainId', (req, res) => {
  const { name, metricLabel = 'value', colorScheme = 'green', baseline = 0 } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

  const db = load();
  if (!db.domains.find((d) => d.id === req.params.domainId)) {
    return res.status(404).json({ error: 'Domain not found' });
  }

  const domainGraphs = db.graphs.filter((g) => g.domainId === req.params.domainId);
  const graph = {
    id: newId(),
    domainId: req.params.domainId,
    name: name.trim(),
    metricLabel,
    colorScheme,
    baseline: Number(baseline),
    position: domainGraphs.length,
    isHidden: false,
    isArchived: false,
    createdAt: new Date().toISOString(),
  };
  db.graphs.push(graph);
  save(db);
  res.status(201).json(graph);
});

router.put('/:id', (req, res) => {
  const db = load();
  const idx = db.graphs.findIndex((g) => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const { name, metricLabel, colorScheme, baseline, isHidden, isArchived, position } = req.body;
  const graph = { ...db.graphs[idx] };
  if (name != null) graph.name = name.trim();
  if (metricLabel != null) graph.metricLabel = metricLabel;
  if (colorScheme != null) graph.colorScheme = colorScheme;
  if (baseline != null) graph.baseline = Number(baseline);
  if (isHidden != null) graph.isHidden = Boolean(isHidden);
  if (isArchived != null) graph.isArchived = Boolean(isArchived);
  if (position != null) graph.position = Number(position);
  db.graphs[idx] = graph;
  save(db);
  res.json(graph);
});

router.delete('/:id', (req, res) => {
  const db = load();
  const before = db.graphs.length;
  db.graphs = db.graphs.filter((g) => g.id !== req.params.id);
  if (db.graphs.length === before) return res.status(404).json({ error: 'Not found' });
  db.dayData = db.dayData.filter((d) => d.graphId !== req.params.id);
  save(db);
  res.status(204).end();
});

module.exports = router;
