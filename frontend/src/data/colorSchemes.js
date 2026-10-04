const EMPTY = 'rgba(255, 255, 255, 0.08)';

export const COLOR_SCHEMES = {
  green:  { label: 'Green',  levels: [EMPTY, '#6ee7b7', '#34d399', '#10b981', '#059669'] },
  blue:   { label: 'Blue',   levels: [EMPTY, '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7'] },
  red:    { label: 'Red',    levels: [EMPTY, '#fca5a5', '#f87171', '#ef4444', '#dc2626'] },
  purple: { label: 'Purple', levels: [EMPTY, '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed'] },
  orange: { label: 'Orange', levels: [EMPTY, '#fdba74', '#fb923c', '#f97316', '#ea580c'] },
  teal:   { label: 'Teal',   levels: [EMPTY, '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488'] },
  pink:   { label: 'Pink',   levels: [EMPTY, '#f9a8d4', '#f472b6', '#ec4899', '#db2777'] },
  yellow: { label: 'Yellow', levels: [EMPTY, '#fde047', '#facc15', '#eab308', '#ca8a04'] },
};

export const DEFAULT_SCHEME = 'purple';
