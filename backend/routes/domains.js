const express = require('express');
const { load, save, newId } = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const { domains } = load();
  res.json([...domains].sort((a, b) => a.position - b.position || a.createdAt.localeCompare(b.createdAt)));
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

  const db = load();
  const position = db.domains.length;
  const domain = {
    id: newId(),
    name: name.trim(),
    isHidden: false,
    isArchived: false,
    position,
    createdAt: new Date().toISOString(),
  };
  db.domains.push(domain);
  save(db);
  res.status(201).json(domain);
});

router.put('/:id', (req, res) => {
  const db = load();
  const idx = db.domains.findIndex((d) => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const { name, isHidden, isArchived, position } = req.body;
  const domain = { ...db.domains[idx] };
  if (name != null) domain.name = name.trim();
  if (isHidden != null) domain.isHidden = Boolean(isHidden);
  if (isArchived != null) domain.isArchived = Boolean(isArchived);
  if (position != null) domain.position = Number(position);
  db.domains[idx] = domain;
  save(db);
  res.json(domain);
});

router.delete('/:id', (req, res) => {
  const db = load();
  const before = db.domains.length;
  db.domains = db.domains.filter((d) => d.id !== req.params.id);
  if (db.domains.length === before) return res.status(404).json({ error: 'Not found' });

  const graphIds = db.graphs.filter((g) => g.domainId === req.params.id).map((g) => g.id);
  db.graphs = db.graphs.filter((g) => g.domainId !== req.params.id);
  db.dayData = db.dayData.filter((d) => !graphIds.includes(d.graphId));
  save(db);
  res.status(204).end();
});

module.exports = router;
