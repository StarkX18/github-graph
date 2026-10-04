import { useEffect, useRef, useState } from 'react';
import { formatDate } from '../../utils/date.js';
import {
  createEmptyEntry,
  entriesFromDay,
  entryTabLabel,
  hasValidEntries,
  readImageFile,
  serializeEntries,
} from '../../utils/entries.js';
import '../GraphModal/GraphModal.css';
import './DataModal.css';

export function DataModal({ graph, day, onSave, onDelete, onClose }) {
  const hasData = day.value > 0;
  const [entries, setEntries] = useState(() => entriesFromDay(day));
  const [activeId, setActiveId] = useState(() => entriesFromDay(day)[0]?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(null);
  const imageInputRef = useRef(null);

  const activeEntry = entries.find((e) => e.id === activeId) ?? entries[0];

  useEffect(() => {
    if (!entries.some((e) => e.id === activeId)) {
      setActiveId(entries[0]?.id ?? null);
    }
  }, [entries, activeId]);

  function updateEntry(id, updates) {
    setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry)));
  }

  function addEntry() {
    const entry = createEmptyEntry();
    setEntries((prev) => [...prev, entry]);
    setActiveId(entry.id);
  }

  function removeEntry(id) {
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      const next = prev.filter((e) => e.id !== id);
      if (next.length === 0) {
        const blank = createEmptyEntry();
        setActiveId(blank.id);
        return [blank];
      }
      if (activeId === id) {
        const neighbor = next[Math.min(idx, next.length - 1)];
        setActiveId(neighbor.id);
      }
      return next;
    });
  }

  async function handleImageChange(id, file) {
    setImageError(null);
    try {
      const dataUrl = await readImageFile(file);
      updateEntry(id, { image: dataUrl });
    } catch (err) {
      setImageError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = serializeEntries(entries);
    if (payload.length === 0) return;
    setSaving(true);
    try {
      await onSave(day.date, payload);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!hasData) return;
    setDeleting(true);
    try {
      await onDelete(day.date);
      onClose();
    } finally {
      setDeleting(false);
    }
  }

  const isValid = hasValidEntries(entries);
  const totalQuantity = serializeEntries(entries).reduce((sum, entry) => sum + entry.quantity, 0);

  if (!activeEntry) return null;

  return (
    <div className="modal-overlay modal-overlay--popover" onClick={onClose}>
      <div className="modal modal--data mac-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={formatDate(day.date)}>
        <div className="mac-titlebar mac-titlebar--sheet">
          <div className="mac-titlebar__lights">
            <button type="button" className="mac-light mac-light--close" onClick={onClose} aria-label="Close" />
            <span className="mac-light mac-light--min" aria-hidden="true" />
            <span className="mac-light mac-light--max" aria-hidden="true" />
          </div>
          <span className="mac-titlebar__title">{formatDate(day.date)}</span>
          <span className="mac-titlebar__subtitle">{graph.name}</span>
        </div>

        <form onSubmit={handleSubmit} className="data-modal__form">
          <div className="mac-segmented data-modal__tabs" role="tablist" aria-label="Entries">
            {entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={entry.id === activeId}
                className={`mac-segmented__item${entry.id === activeId ? ' mac-segmented__item--active' : ''}`}
                onClick={() => setActiveId(entry.id)}
                title={entryTabLabel(entry)}
              >
                {entryTabLabel(entry)}
              </button>
            ))}
            <button
              type="button"
              className="mac-segmented__add"
              onClick={addEntry}
              aria-label="Add entry"
              title="Add entry"
            >
              +
            </button>
          </div>

          <div className="data-modal__pane" role="tabpanel">
            <div className="data-modal__row">
              <label className="data-modal__qty">
                <span className="data-modal__qty-label">{graph.metricLabel}</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={activeEntry.quantity}
                  onChange={(e) => updateEntry(activeEntry.id, { quantity: e.target.value })}
                  placeholder="0"
                  autoFocus
                />
              </label>
              {entries.length > 1 && (
                <button
                  type="button"
                  className="data-modal__remove-tab mac-text-btn mac-text-btn--destructive"
                  onClick={() => removeEntry(activeEntry.id)}
                >
                  Remove
                </button>
              )}
            </div>

            <input
              className="mac-field"
              type="text"
              value={activeEntry.description}
              onChange={(e) => updateEntry(activeEntry.id, { description: e.target.value })}
              placeholder="Description"
            />

            <input
              className="mac-field"
              type="url"
              value={activeEntry.link}
              onChange={(e) => updateEntry(activeEntry.id, { link: e.target.value })}
              placeholder="Link"
            />

            <div className="data-modal__attach-row">
              <input
                ref={imageInputRef}
                className="data-modal__file-hidden"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) handleImageChange(activeEntry.id, file);
                }}
              />
              <button
                type="button"
                className="mac-chip-btn"
                onClick={() => imageInputRef.current?.click()}
              >
                {activeEntry.image ? 'Change photo' : 'Add photo'}
              </button>
              {activeEntry.image && (
                <>
                  <img src={activeEntry.image} alt="" className="data-modal__thumb" />
                  <button
                    type="button"
                    className="mac-text-btn"
                    onClick={() => updateEntry(activeEntry.id, { image: '' })}
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {imageError && <p className="data-modal__error">{imageError}</p>}

          <div className="data-modal__footer">
            <div className="data-modal__footer-left">
              {hasData && (
                <button
                  type="button"
                  className="mac-text-btn mac-text-btn--destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Clearing…' : 'Clear day'}
                </button>
              )}
              {isValid && (
                <span className="data-modal__total">
                  Total <strong>{totalQuantity}</strong>
                </span>
              )}
            </div>
            <div className="data-modal__footer-actions">
              <button type="button" className="mac-btn mac-btn--default" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="mac-btn mac-btn--primary" disabled={saving || !isValid}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
