import { useState } from 'react';
import { formatDate } from '../../utils/date.js';
import '../GraphModal/GraphModal.css';
import './DataModal.css';

export function DataModal({ graph, day, onSave, onDelete, onClose }) {
  const hasData = day.value > 0;
  const [value, setValue] = useState(hasData ? String(day.value) : '');
  const [note, setNote] = useState(day.note ?? '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const num = parseFloat(value);
    if (!Number.isFinite(num)) return;
    setSaving(true);
    try {
      await onSave(day.date, num, note.trim());
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

  const parsedValue = parseFloat(value);
  const isValid = Number.isFinite(parsedValue);

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

        <form onSubmit={handleSubmit} className="modal__body">
          <label className="modal__field">
            <span className="modal__label">{graph.metricLabel}</span>
            <input
              className="modal__input data-modal__value-input"
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value…"
              autoFocus
            />
          </label>

          <label className="modal__field">
            <span className="modal__label">
              Note
              <span className="modal__label-hint">optional</span>
            </span>
            <textarea
              className="modal__input data-modal__note-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note…"
              rows={2}
            />
          </label>

          <div className="modal__footer">
            {hasData && (
              <button
                type="button"
                className="modal__btn data-modal__delete-btn"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Removing…' : 'Remove data'}
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
