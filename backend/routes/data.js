const express = require('express');
const { load, save } = require('../db');
const { dayRecordToResponse, sanitizeEntriesForSave } = require('../entryUtils');

const router = express.Router();

router.get('/graph/:graphId', (req, res) => {
  const { dayData } = load();
  res.json(
    dayData
      .filter((d) => d.graphId === req.params.graphId)
      .map(dayRecordToResponse)
      .sort((a, b) => a.date.localeCompare(b.date)),
  );
});

router.put('/graph/:graphId/:date', (req, res) => {
  const { entries } = req.body;
  if (!Array.isArray(entries)) {
    return res.status(400).json({ error: 'entries must be an array' });
  }

  const sanitized = sanitizeEntriesForSave(entries);

  const db = load();
  if (!db.graphs.find((g) => g.id === req.params.graphId)) {
    return res.status(404).json({ error: 'Graph not found' });
  }

  const existing = db.dayData.findIndex(
    (d) => d.graphId === req.params.graphId && d.date === req.params.date,
  );

  if (sanitized.length === 0) {
    if (existing >= 0) {
      db.dayData.splice(existing, 1);
      save(db);
    }
    return res.json({ date: req.params.date, value: 0, note: '', entries: [] });
  }

  const entry = {
    graphId: req.params.graphId,
    date: req.params.date,
    entries: sanitized,
  };

  if (existing >= 0) {
    db.dayData[existing] = entry;
  } else {
    db.dayData.push(entry);
  }
  save(db);
  res.json(dayRecordToResponse(entry));
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
