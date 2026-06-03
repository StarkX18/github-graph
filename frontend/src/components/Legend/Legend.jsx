import { COLOR_SCHEMES, DEFAULT_SCHEME } from '../../data/colorSchemes.js';
import './Legend.css';

export function Legend({ colorScheme }) {
  const colors = COLOR_SCHEMES[colorScheme]?.levels ?? COLOR_SCHEMES[DEFAULT_SCHEME].levels;

  return (
    <div className="legend" aria-label="Activity intensity legend">
      <span>Less</span>
      <span className="legend__cells" aria-hidden="true">
        {colors.map((color, index) => (
          <span
            className="legend__cell"
            key={index}
            style={{ background: color }}
            title={`Level ${index}`}
          />
        ))}
      </span>
      <span>More</span>
    </div>
  );
}
