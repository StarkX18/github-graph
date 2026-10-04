import { useRef, useState } from 'react';
import './DomainTabs.css';

export function DomainTabs({
  domains,
  activeDomainId,
  onSelect,
  onAdd,
  onEdit,
  onToggleHide,
  onToggleArchive,
  onDelete,
}) {
  const [menuDomainId, setMenuDomainId] = useState(null);
  const menuDomain = domains.find((d) => d.id === menuDomainId) ?? null;

  function openMenu(e, domainId) {
    e.stopPropagation();
    setMenuDomainId((prev) => (prev === domainId ? null : domainId));
  }

  function closeMenu() {
    setMenuDomainId(null);
  }

  const visibleDomains = domains.filter((d) => !d.isArchived);
  const archivedDomains = domains.filter((d) => d.isArchived);

  return (
    <div className="domain-tabs-bar">
      <div className="domain-tabs-bar__sheets">
        {visibleDomains.map((domain) => {
          const isActive = domain.id === activeDomainId;
          return (
            <div
              key={domain.id}
              className={[
                'domain-tab',
                isActive ? 'domain-tab--active' : '',
                domain.isHidden ? 'domain-tab--hidden' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <button
                className="domain-tab__label"
                onClick={() => onSelect(domain.id)}
                title={domain.isHidden ? `${domain.name} (hidden)` : domain.name}
              >
                {domain.name}
                {domain.isHidden && <span className="domain-tab__hidden-dot" title="Hidden" />}
              </button>

              <div className="domain-tab__menu-wrap">
                <button
                  className="domain-tab__menu-btn"
                  aria-label={`Options for ${domain.name}`}
                  onClick={(e) => openMenu(e, domain.id)}
                >
                  ▾
                </button>
                {menuDomainId === domain.id && (
                  <>
                    <div className="domain-tab__backdrop" onClick={closeMenu} />
                    <div className="domain-tab__menu">
                      <button onClick={() => { closeMenu(); onEdit(domain); }}>
                        Rename
                      </button>
                      <button onClick={() => { closeMenu(); onToggleHide(domain); }}>
                        {domain.isHidden ? 'Unhide' : 'Hide'}
                      </button>
                      <button onClick={() => { closeMenu(); onToggleArchive(domain); }}>
                        Archive
                      </button>
                      <div className="domain-tab__menu-divider" />
                      <button
                        className="domain-tab__menu-item--danger"
                        onClick={() => {
                          closeMenu();
                          if (window.confirm(`Delete domain "${domain.name}"? All its graphs and data will be deleted.`)) {
                            onDelete(domain.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {archivedDomains.length > 0 && (
          <div className="domain-tabs-bar__archived-group">
            {archivedDomains.map((domain) => (
              <div key={domain.id} className="domain-tab domain-tab--archived">
                <button
                  className="domain-tab__label"
                  onClick={() => onSelect(domain.id)}
                  title={`${domain.name} (archived)`}
                >
                  {domain.name}
                </button>
                <div className="domain-tab__menu-wrap">
                  <button
                    className="domain-tab__menu-btn"
                    onClick={(e) => openMenu(e, domain.id)}
                  >
                    ▾
                  </button>
                  {menuDomainId === domain.id && (
                    <>
                      <div className="domain-tab__backdrop" onClick={closeMenu} />
                      <div className="domain-tab__menu">
                        <button onClick={() => { closeMenu(); onToggleArchive(domain); }}>
                          Unarchive
                        </button>
                        <button onClick={() => { closeMenu(); onEdit(domain); }}>
                          Rename
                        </button>
                        <div className="domain-tab__menu-divider" />
                        <button
                          className="domain-tab__menu-item--danger"
                          onClick={() => {
                            closeMenu();
                            if (window.confirm(`Delete domain "${domain.name}"?`)) {
                              onDelete(domain.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <button type="button" className="domain-tabs-bar__add-btn mac-icon-btn" onClick={onAdd} title="New sheet">
          +
        </button>
      </div>
    </div>
  );
}
