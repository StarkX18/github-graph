import { useCallback, useEffect, useState } from 'react';
import { api } from './api/client.js';
import { GraphCard } from './components/GraphCard/GraphCard.jsx';
import { DomainTabs } from './components/DomainTabs/DomainTabs.jsx';
import { GraphModal } from './components/GraphModal/GraphModal.jsx';
import { DataModal } from './components/DataModal/DataModal.jsx';

export default function App() {
  const [domains, setDomains] = useState([]);
  const [activeDomainId, setActiveDomainId] = useState(null);
  const [graphs, setGraphs] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [domainEditTarget, setDomainEditTarget] = useState(null);
  const [domainNameInput, setDomainNameInput] = useState('');
  const [domainModalOpen, setDomainModalOpen] = useState(false);

  const [graphModalTarget, setGraphModalTarget] = useState(null);
  const [graphModalOpen, setGraphModalOpen] = useState(false);

  const [dataModal, setDataModal] = useState(null);

  useEffect(() => {
    api.getDomains()
      .then((data) => {
        setDomains(data);
        const first = data.find((d) => !d.isArchived);
        if (first) setActiveDomainId(first.id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeDomainId) {
      setGraphs([]);
      setGraphData({});
      return;
    }
    api.getGraphs(activeDomainId).then(async (gs) => {
      setGraphs(gs);
      const entries = await Promise.all(
        gs.map(async (g) => [g.id, await api.getData(g.id)]),
      );
      setGraphData(Object.fromEntries(entries));
    }).catch((e) => setError(e.message));
  }, [activeDomainId]);

  const refreshGraphData = useCallback(async (graphId) => {
    const data = await api.getData(graphId);
    setGraphData((prev) => ({ ...prev, [graphId]: data }));
  }, []);

  async function handleAddDomain() {
    setDomainEditTarget(null);
    setDomainNameInput('');
    setDomainModalOpen(true);
  }

  async function handleEditDomain(domain) {
    setDomainEditTarget(domain);
    setDomainNameInput(domain.name);
    setDomainModalOpen(true);
  }

  async function saveDomain() {
    if (!domainNameInput.trim()) return;
    if (domainEditTarget) {
      const updated = await api.updateDomain(domainEditTarget.id, { name: domainNameInput.trim() });
      setDomains((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    } else {
      const created = await api.createDomain(domainNameInput.trim());
      setDomains((prev) => [...prev, created]);
      setActiveDomainId(created.id);
    }
    setDomainModalOpen(false);
  }

  async function handleToggleHideDomain(domain) {
    const updated = await api.updateDomain(domain.id, { isHidden: !domain.isHidden });
    setDomains((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  }

  async function handleToggleArchiveDomain(domain) {
    const updated = await api.updateDomain(domain.id, { isArchived: !domain.isArchived });
    setDomains((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    if (!domain.isArchived && activeDomainId === domain.id) {
      const next = domains.find((d) => d.id !== domain.id && !d.isArchived);
      setActiveDomainId(next?.id ?? null);
    }
  }

  async function handleDeleteDomain(id) {
    await api.deleteDomain(id);
    setDomains((prev) => prev.filter((d) => d.id !== id));
    if (activeDomainId === id) {
      const next = domains.find((d) => d.id !== id && !d.isArchived);
      setActiveDomainId(next?.id ?? null);
    }
  }

  function openAddGraph() {
    setGraphModalTarget(null);
    setGraphModalOpen(true);
  }

  function openEditGraph(graph) {
    setGraphModalTarget(graph);
    setGraphModalOpen(true);
  }

  async function handleSaveGraph(data) {
    if (graphModalTarget) {
      const updated = await api.updateGraph(graphModalTarget.id, data);
      setGraphs((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    } else {
      const created = await api.createGraph(activeDomainId, data);
      setGraphs((prev) => [...prev, created]);
      setGraphData((prev) => ({ ...prev, [created.id]: [] }));
    }
  }

  async function handleDeleteGraph(id) {
    await api.deleteGraph(id);
    setGraphs((prev) => prev.filter((g) => g.id !== id));
    setGraphData((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function handleToggleHideGraph(graph) {
    const updated = await api.updateGraph(graph.id, { isHidden: !graph.isHidden });
    setGraphs((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  }

  async function handleToggleArchiveGraph(graph) {
    const updated = await api.updateGraph(graph.id, { isArchived: !graph.isArchived });
    setGraphs((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  }

  function handleCellClick(graph, day) {
    setDataModal({ graph, day });
  }

  async function handleSaveData(date, entries) {
    const { graph } = dataModal;
    await api.setData(graph.id, date, entries);
    await refreshGraphData(graph.id);
  }

  async function handleDeleteData(date) {
    const { graph } = dataModal;
    await api.deleteData(graph.id, date);
    await refreshGraphData(graph.id);
  }

  const activeDomain = domains.find((d) => d.id === activeDomainId) ?? null;
  const visibleGraphs = graphs.filter((g) => !g.isArchived);

  if (loading) {
    return (
      <div className="page page--loading">
        <p className="page--loading__text">Loading your graphs…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page page--error">
        <p>Could not connect to the backend: <strong>{error}</strong></p>
        <p>Make sure the backend is running on port 3001.</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <span className="app-header__brand">
          <span className="app-header__mark" aria-hidden="true">
            <span className="app-header__mark-cell app-header__mark-cell--0" />
            <span className="app-header__mark-cell app-header__mark-cell--1" />
            <span className="app-header__mark-cell app-header__mark-cell--2" />
            <span className="app-header__mark-cell app-header__mark-cell--0" />
            <span className="app-header__mark-cell app-header__mark-cell--3" />
            <span className="app-header__mark-cell app-header__mark-cell--1" />
            <span className="app-header__mark-cell app-header__mark-cell--0" />
            <span className="app-header__mark-cell app-header__mark-cell--2" />
            <span className="app-header__mark-cell app-header__mark-cell--3" />
          </span>
          Activity
        </span>
        {activeDomain && (
          <span className="app-header__domain">{activeDomain.name}</span>
        )}
        {activeDomainId && (
          <button type="button" className="app-header__add-graph mac-icon-btn" onClick={openAddGraph} title="Add graph">+</button>
        )}
      </header>

      <main className="app-content">
        {domains.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon" aria-hidden="true">◫</div>
            <p className="empty-state__title">No sheets yet</p>
            <p className="empty-state__subtitle">Create your first sheet to start tracking anything.</p>
            <button type="button" className="empty-state__btn mac-btn mac-btn--primary" onClick={handleAddDomain}>
              Create sheet
            </button>
          </div>
        ) : !activeDomainId ? (
          <div className="empty-state">
            <p className="empty-state__title">Select a sheet</p>
          </div>
        ) : (
          <div className="graphs-col">
            {visibleGraphs.map((graph) => (
              <GraphCard
                key={graph.id}
                graph={graph}
                data={graphData[graph.id] ?? []}
                onEdit={openEditGraph}
                onDelete={handleDeleteGraph}
                onToggleHide={handleToggleHideGraph}
                onToggleArchive={handleToggleArchiveGraph}
                onCellClick={handleCellClick}
              />
            ))}
          </div>
        )}
      </main>

      <DomainTabs
        domains={domains}
        activeDomainId={activeDomainId}
        onSelect={setActiveDomainId}
        onAdd={handleAddDomain}
        onEdit={handleEditDomain}
        onToggleHide={handleToggleHideDomain}
        onToggleArchive={handleToggleArchiveDomain}
        onDelete={handleDeleteDomain}
      />

      {domainModalOpen && (
        <div className="modal-overlay" onClick={() => setDomainModalOpen(false)}>
          <div className="modal modal--domain" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">
                {domainEditTarget ? 'Rename sheet' : 'New sheet'}
              </h2>
              <button className="modal__close" onClick={() => setDomainModalOpen(false)}>✕</button>
            </div>
            <div className="modal__body">
              <label className="modal__field">
                <span className="modal__label">Name</span>
                <input
                  className="modal__input"
                  type="text"
                  value={domainNameInput}
                  onChange={(e) => setDomainNameInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveDomain(); }}
                  placeholder="e.g. Fitness, Work, Learning"
                  autoFocus
                />
              </label>
              <div className="modal__footer">
                <button className="modal__btn modal__btn--secondary" onClick={() => setDomainModalOpen(false)}>Cancel</button>
                <button className="modal__btn modal__btn--primary" onClick={saveDomain} disabled={!domainNameInput.trim()}>
                  {domainEditTarget ? 'Rename' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {graphModalOpen && (
        <GraphModal
          graph={graphModalTarget}
          onSave={handleSaveGraph}
          onClose={() => setGraphModalOpen(false)}
        />
      )}

      {dataModal && (
        <DataModal
          graph={dataModal.graph}
          day={dataModal.day}
          onSave={handleSaveData}
          onDelete={handleDeleteData}
          onClose={() => setDataModal(null)}
        />
      )}
    </div>
  );
}
