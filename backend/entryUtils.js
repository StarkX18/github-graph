const crypto = require('crypto');

function newEntryId() {
  return crypto.randomUUID();
}

function sumEntryQuantities(entries) {
  return entries.reduce((sum, entry) => sum + (Number(entry.quantity) || 0), 0);
}

function normalizeEntry(raw = {}) {
  const quantity = Number(raw.quantity);
  return {
    id: raw.id || newEntryId(),
    quantity: Number.isFinite(quantity) ? quantity : 0,
    description: String(raw.description ?? '').trim(),
    link: String(raw.link ?? '').trim(),
    image: String(raw.image ?? '').trim(),
  };
}

function normalizeEntries(rawEntries) {
  if (!Array.isArray(rawEntries)) return [];
  return rawEntries.map(normalizeEntry);
}

function sanitizeEntriesForSave(rawEntries) {
  return normalizeEntries(rawEntries).filter((entry) => {
    if (!Number.isFinite(entry.quantity) || entry.quantity <= 0) return false;
    return true;
  });
}

function dayRecordToResponse(record) {
  const entries = normalizeEntries(record.entries);
  if (entries.length === 0 && record.value != null) {
    const legacyValue = Number(record.value);
    const legacyNote = String(record.note ?? '').trim();
    if (Number.isFinite(legacyValue) && legacyValue > 0) {
      entries.push(
        normalizeEntry({
          quantity: legacyValue,
          description: legacyNote,
        }),
      );
    }
  }

  const value = sumEntryQuantities(entries);
  const note = entries
    .map((entry) => entry.description)
    .filter(Boolean)
    .join(' · ');

  return { date: record.date, value, note, entries };
}

module.exports = {
  newEntryId,
  sumEntryQuantities,
  normalizeEntry,
  normalizeEntries,
  sanitizeEntriesForSave,
  dayRecordToResponse,
};
