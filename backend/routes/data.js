const express = require('express');
const { load, save } = require('../db');

const router = express.Router();

router.get('/graph/:graphId', (req, res) => {
  const { dayData } = load();
  res.json(
    dayData
      .filter((d) => d.graphId === req.params.graphId)
      .map(({ date, value, note }) => ({ date, value, note }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  );
});

router.put('/graph/:graphId/:date', (req, res) => {
  const { value, note = '' } = req.body;
  if (value == null || !Number.isFinite(Number(value))) {
    return res.status(400).json({ error: 'value must be a number' });
  }

  const db = load();
  if (!db.graphs.find((g) => g.id === req.params.graphId)) {
    return res.status(404).json({ error: 'Graph not found' });
  }

  const existing = db.dayData.findIndex(
    (d) => d.graphId === req.params.graphId && d.date === req.params.date,
  );
  const entry = { graphId: req.params.graphId, date: req.params.date, value: Number(value), note };

  if (existing >= 0) {
    db.dayData[existing] = entry;
  } else {
    db.dayData.push(entry);
  }
  save(db);
  res.json({ date: entry.date, value: entry.value, note: entry.note });
});

router.delete('/graph/:graphId/:date', (req, res) => {
  const db = load();
  const before = db.dayData.length;
  db.dayData = db.dayData.filter(
    (d) => !(d.graphId === req.params.graphId && d.date === req.params.date),
  );
  if (db.dayData.length === before) return res.status(404).json({ error: 'Not found' });
  save(db);
  res.status(204).end();
});

module.exports = router;
