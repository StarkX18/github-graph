import { useMemo, useRef, useState } from 'react';
import { ContributionGraph } from '../ContributionGraph/ContributionGraph.jsx';
import { Legend } from '../Legend/Legend.jsx';
import { COLOR_SCHEMES, DEFAULT_SCHEME } from '../../data/colorSchemes.js';
import { buildGraphDays } from '../../utils/activity.js';
import './GraphCard.css';

export function GraphCard({ graph, data, onEdit, onDelete, onToggleHide, onToggleArchive, onCellClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const colors = COLOR_SCHEMES[graph.colorScheme]?.levels ?? COLOR_SCHEMES[DEFAULT_SCHEME].levels;

  const total = useMemo(() => {
    const graphDays = buildGraphDays(data);
    return graphDays.reduce((sum, day) => (day.isFuture ? sum : sum + day.value), 0);
  }, [data]);

  function closeMenu() { setMenuOpen(false); }
  function handleMenuToggle(e) { e.stopPropagation(); setMenuOpen((v) => !v); }
  function handleEdit() { closeMenu(); onEdit(graph); }
  function handleDelete() {
    closeMenu();
    if (window.confirm(`Delete graph "${graph.name}"? This will remove all its data.`)) {
      onDelete(graph.id);
    }
  }
  function handleToggleHide() { closeMenu(); onToggleHide(graph); }
  function handleToggleArchive() { closeMenu(); onToggleArchive(graph); }

  const colorVars = {
    '--level-1': colors[1],
    '--level-2': colors[2],
    '--level-3': colors[3],
    '--level-4': colors[4],
  };

  if (graph.isHidden) {
    return (
      <div className="graph-card graph-card--hidden" style={colorVars}>
        <div className="graph-card__header">
          <div className="graph-card__title-row">
            <h2 className="graph-card__title graph-card__title--muted">{graph.name}</h2>
            <div className="graph-card__menu-wrap" ref={menuRef}>
              <button className="graph-card__menu-btn" onClick={handleMenuToggle} aria-label="Graph options">⋯</button>
              {menuOpen && (
                <>
                  <div className="graph-card__menu-backdrop" onClick={closeMenu} />
                  <div className="graph-card__menu">
                    <button onClick={handleToggleHide}>Show graph</button>
                    <button onClick={handleToggleArchive}>Archive graph</button>
                    <button className="graph-card__menu-item--danger" onClick={handleDelete}>Delete graph</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="graph-card" style={colorVars}>
      <div className="graph-card__header">
        <div className="graph-card__title-row">
          <h2 className="graph-card__title">{graph.name}</h2>
          <div className="graph-card__menu-wrap" ref={menuRef}>
            <button
              className="graph-card__menu-btn"
              aria-label="Graph options"
              onClick={handleMenuToggle}
            >
              ⋯
            </button>
            {menuOpen && (
              <>
                <div className="graph-card__menu-backdrop" onClick={closeMenu} />
                <div className="graph-card__menu">
                  <button onClick={handleEdit}>Edit graph</button>
                  <button onClick={handleToggleHide}>Hide graph</button>
                  <button onClick={handleToggleArchive}>Archive graph</button>
                  <button className="graph-card__menu-item--danger" onClick={handleDelete}>Delete graph</button>
                </div>
              </>
            )}
          </div>
        </div>
        <p className="graph-card__summary">
          {total > 0 ? (
            <>
              <span className="graph-card__total">{total}</span>{' '}
              {graph.metricLabel} in the last year
            </>
          ) : (
            <span className="graph-card__empty">No data yet — click any day to add</span>
          )}
        </p>
      </div>

      <div className="graph-card__body">
        <ContributionGraph
          days={data}
          baseline={graph.baseline}
          colors={colors}
          onCellClick={(day) => onCellClick(graph, day)}
        />
        <Legend colorScheme={graph.colorScheme} />
      </div>
    </div>
  );
}
