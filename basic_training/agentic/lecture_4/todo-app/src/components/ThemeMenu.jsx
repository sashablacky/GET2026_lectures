import { useCallback, useRef, useState } from 'react';
import SegmentedControl from './SegmentedControl.jsx';
import { PALETTE_PRESETS } from '../theme.js';
import { useDismiss } from '../useDismiss.js';

const MODE_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'custom', label: 'Custom' },
];

const COLOR_FIELDS = [
  { key: 'bg', label: 'Background' },
  { key: 'sky', label: 'Sky glow' },
  { key: 'accent', label: 'Accent' },
];

function ThemeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" />
    </svg>
  );
}

export default function ThemeMenu({ theme, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const close = useCallback(() => setIsOpen(false), []);
  useDismiss(menuRef, isOpen, close);

  function setMode(mode) {
    onChange({ ...theme, mode });
  }

  function setCustomColors(colors) {
    onChange({ mode: 'custom', custom: { ...theme.custom, ...colors } });
  }

  function isActivePreset(preset) {
    const { bg, sky, accent } = theme.custom;
    return preset.bg === bg && preset.sky === sky && preset.accent === accent;
  }

  return (
    <div className="theme-menu" ref={menuRef}>
      <button
        className="btn btn--ghost btn--icon"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Appearance"
        aria-expanded={isOpen}
      >
        <ThemeIcon />
      </button>

      <div className={`popover popover--end theme-panel ${isOpen ? 'is-open' : ''}`} role="dialog" aria-label="Appearance">
        <p className="popover__title">Appearance</p>
        <SegmentedControl options={MODE_OPTIONS} value={theme.mode} onChange={setMode} label="Theme" />

        <div className={`collapsible ${theme.mode === 'custom' ? 'is-open' : ''}`}>
          <div className="collapsible__inner">
            <p className="popover__label">Presets</p>
            <div className="swatches">
              {PALETTE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className={`swatch ${isActivePreset(preset) ? 'is-active' : ''}`}
                  style={{ '--swatch-bg': preset.bg, '--swatch-sky': preset.sky, '--swatch-accent': preset.accent }}
                  onClick={() => setCustomColors(preset)}
                  aria-label={`${preset.name} palette`}
                  aria-pressed={isActivePreset(preset)}
                  title={preset.name}
                >
                  <span className="swatch__dot" />
                </button>
              ))}
            </div>

            <p className="popover__label">Your colors</p>
            {COLOR_FIELDS.map((field) => (
              <label key={field.key} className="color-field">
                <span>{field.label}</span>
                <span className="color-field__hex">{theme.custom[field.key]}</span>
                <input
                  type="color"
                  value={theme.custom[field.key]}
                  onChange={(e) => setCustomColors({ [field.key]: e.target.value })}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
