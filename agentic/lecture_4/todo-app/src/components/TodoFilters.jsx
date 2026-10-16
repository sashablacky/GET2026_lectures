import { useLayoutEffect, useRef, useState } from 'react';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function TodoFilters({ current, onChange }) {
  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [indicator, setIndicator] = useState(null);

  // Move the sliding pill under the active button, and keep it there when the layout resizes.
  useLayoutEffect(() => {
    function measure() {
      const button = buttonRefs.current[current];
      if (button) setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [current]);

  return (
    <div className="segmented" role="group" aria-label="Filter todos" ref={containerRef}>
      {indicator && (
        <span
          className="segmented__indicator"
          style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
        />
      )}
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          ref={(el) => (buttonRefs.current[option.value] = el)}
          className={`segmented__btn ${current === option.value ? 'is-active' : ''}`}
          onClick={() => onChange(option.value)}
          aria-pressed={current === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
