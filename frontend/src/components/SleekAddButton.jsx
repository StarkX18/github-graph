/** Compact “+” control used for add graph, add sheet, and add entry. */
export function SleekAddButton({ className = '', label = 'Add', ...props }) {
  return (
    <button
      type="button"
      className={['mac-sleek-add', className].filter(Boolean).join(' ')}
      aria-label={label}
      title={label}
      {...props}
    >
      <svg className="mac-sleek-add__icon" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M6 1.25v9.5M1.25 6h9.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      </svg>
    </button>
  );
}
