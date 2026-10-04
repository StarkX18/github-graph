import { useState } from 'react';
import { formatDate } from '../../utils/date.js';
import {
  createEmptyEntry,
  entriesFromDay,
  hasValidEntries,
  readImageFile,
  serializeEntries,
} from '../../utils/entries.js';
import '../GraphModal/GraphModal.css';
import './DataModal.css';

export function DataModal({ graph, day, onSave, onDelete, onClose }) {
  const hasData = day.value > 0;
  const [entries, setEntries] = useState(() => entriesFromDay(day));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(null);

  function updateEntry(id, updates) {
    setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry)));
  }

  function addEntry() {
    setEntries((prev) => [...prev, createEmptyEntry()]);
  }

  function removeEntry(id) {
    setEntries((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      return next.length > 0 ? next : [createEmptyEntry()];
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--data" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div>
            <h2 className="modal__title">{formatDate(day.date)}</h2>
            <p className="data-modal__graph-name">{graph.name}</p>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body data-modal__body">
          <div className="data-modal__entries">
            {entries.map((entry, index) => (
              <div key={entry.id} className="data-modal__entry">
                <div className="data-modal__entry-header">
                  <span className="data-modal__entry-title">Entry {index + 1}</span>
                  {(entries.length > 1 || hasData) && (
                    <button
                      type="button"
                      className="data-modal__entry-remove"
                      onClick={() => removeEntry(entry.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <label className="modal__field">
                  <span className="modal__label">{graph.metricLabel}</span>
                  <input
                    className="modal__input data-modal__value-input"
                    type="number"
                    step="any"
                    min="0"
                    value={entry.quantity}
                    onChange={(e) => updateEntry(entry.id, { quantity: e.target.value })}
                    placeholder="Quantity"
                  />
                </label>

                <label className="modal__field">
                  <span className="modal__label">
                    Description
                    <span className="modal__label-hint">optional</span>
                  </span>
                  <textarea
                    className="modal__input data-modal__note-input"
                    value={entry.description}
                    onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
                    placeholder="What did you do?"
                    rows={2}
                  />
                </label>

                <label className="modal__field">
                  <span className="modal__label">
                    Link
                    <span className="modal__label-hint">optional</span>
                  </span>
                  <input
                    className="modal__input"
                    type="url"
                    value={entry.link}
                    onChange={(e) => updateEntry(entry.id, { link: e.target.value })}
                    placeholder="https://…"
                  />
                </label>

                <div className="modal__field">
                  <span className="modal__label">
                    Image
                    <span className="modal__label-hint">optional</span>
                  </span>
                  <input
                    className="modal__input data-modal__file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (file) handleImageChange(entry.id, file);
                    }}
                  />
                  {entry.image && (
                    <div className="data-modal__image-preview-wrap">
                      <img src={entry.image} alt="" className="data-modal__image-preview" />
                      <button
                        type="button"
                        className="data-modal__image-clear"
                        onClick={() => updateEntry(entry.id, { image: '' })}
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {imageError && <p className="data-modal__error">{imageError}</p>}

          <button type="button" className="data-modal__add-entry" onClick={addEntry}>
            + Add another entry
          </button>

          {isValid && (
            <p className="data-modal__total">
              Day total: <strong>{totalQuantity}</strong> {graph.metricLabel}
            </p>
          )}

          <div className="modal__footer">
            {hasData && (
              <button
                type="button"
                className="modal__btn data-modal__delete-btn"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Removing…' : 'Remove all data'}
              </button>
            )}
            <div className="data-modal__footer-right">
              <button type="button" className="modal__btn modal__btn--secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="modal__btn modal__btn--primary"
                disabled={saving || !isValid}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
