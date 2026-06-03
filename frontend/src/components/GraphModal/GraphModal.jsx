import { useState } from 'react';
import { COLOR_SCHEMES, DEFAULT_SCHEME } from '../../data/colorSchemes.js';
import './GraphModal.css';

export function GraphModal({ graph, onSave, onClose }) {
  const isEdit = Boolean(graph);
  const [name, setName] = useState(graph?.name ?? '');
  const [metricLabel, setMetricLabel] = useState(graph?.metricLabel ?? '');
  const [colorScheme, setColorScheme] = useState(graph?.colorScheme ?? DEFAULT_SCHEME);
  const [baseline, setBaseline] = useState(graph?.baseline ?? 0);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), metricLabel: metricLabel.trim() || 'value', colorScheme, baseline: Number(baseline) });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{isEdit ? 'Edit graph' : 'New graph'}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">
          <label className="modal__field">
            <span className="modal__label">Name</span>
            <input
              className="modal__input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pushups, Sleep hours, Pages read"
              autoFocus
              required
            />
          </label>

          <label className="modal__field">
            <span className="modal__label">Metric label</span>
            <input
              className="modal__input"
              type="text"
              value={metricLabel}
              onChange={(e) => setMetricLabel(e.target.value)}
              placeholder="e.g. pushups, hours, pages (defaults to 'value')"
            />
          </label>

          <div className="modal__field">
            <span className="modal__label">Color scheme</span>
            <div className="modal__color-grid">
              {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                <button
                  key={key}
                  type="button"
                  className={`modal__color-option${colorScheme === key ? ' modal__color-option--selected' : ''}`}
                  onClick={() => setColorScheme(key)}
                  title={scheme.label}
                >
                  <span className="modal__color-swatches">
                    {scheme.levels.slice(1).map((c, i) => (
                      <span key={i} style={{ background: c }} />
                    ))}
                  </span>
                  <span className="modal__color-name">{scheme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="modal__field">
            <span className="modal__label">
              Baseline
              <span className="modal__label-hint">Values at or below this are shown as empty</span>
            </span>
            <input
              className="modal__input modal__input--short"
              type="number"
              min="0"
              step="any"
              value={baseline}
              onChange={(e) => setBaseline(e.target.value)}
            />
          </label>

          <div className="modal__footer">
            <button type="button" className="modal__btn modal__btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal__btn modal__btn--primary" disabled={saving || !name.trim()}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create graph'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
