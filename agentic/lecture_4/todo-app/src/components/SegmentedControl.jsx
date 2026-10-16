import { useLayoutEffect, useRef, useState } from 'react';

/** A row of options with one pill that slides under the selected option. */
export default function SegmentedControl({ options, value, onChange, label }) {
  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [indicator, setIndicator] = useState(null);

  // Move the sliding pill under the active button, and keep it there when the layout resizes.
  useLayoutEffect(() => {
    function measure() {
      const button = buttonRefs.current[value];
      if (button) setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="segmented" role="group" aria-label={label} ref={containerRef}>
      {indicator && (
        <span
          className="segmented__indicator"
          style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
        />
      )}
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          ref={(el) => (buttonRefs.current[option.value] = el)}
          className={`segmented__btn ${value === option.value ? 'is-active' : ''}`}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
