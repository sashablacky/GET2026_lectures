import { useCallback, useEffect, useRef, useState } from 'react';

const PASSWORD_MASK = '•';
const TYPING_PAUSE_MS = 600;
const canvasContext = document.createElement('canvas').getContext('2d');

function measureTextWidth(text, style) {
  canvasContext.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  return canvasContext.measureText(text).width;
}

/**
 * A regular <input> with the native caret hidden and replaced by a custom one
 * that glides between positions and fades in and out while idle.
 */
export default function SmoothInput({ className = '', ...inputProps }) {
  const inputRef = useRef(null);
  const typingTimer = useRef(null);
  const [caret, setCaret] = useState({ x: 0, visible: false, instant: true });
  const [isTyping, setIsTyping] = useState(false);

  const updateCaret = useCallback(() => {
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;

      const { value, type } = input;
      // Some input types (e.g. email, number) don't expose a selection; assume the end.
      const selectionStart = input.selectionStart ?? value.length;
      const selectionEnd = input.selectionEnd ?? value.length;
      const isFocused = document.activeElement === input;
      if (!isFocused || selectionStart !== selectionEnd) {
        setCaret((prev) => ({ ...prev, visible: false }));
        return;
      }

      const style = getComputedStyle(input);
      const textBeforeCaret =
        type === 'password' ? PASSWORD_MASK.repeat(selectionStart) : value.slice(0, selectionStart);
      const paddingLeft = parseFloat(style.paddingLeft);
      const paddingRight = parseFloat(style.paddingRight);
      const textEdge = Math.min(
        paddingLeft + measureTextWidth(textBeforeCaret, style) - input.scrollLeft,
        input.clientWidth - paddingRight
      );
      // Center the 1px bar on the gap and snap to whole device pixels so it stays crisp.
      const pixelRatio = window.devicePixelRatio || 1;
      const x = Math.round((textEdge - 0.5) * pixelRatio) / pixelRatio;

      // Appear in place when focusing; glide only between positions while focused.
      setCaret((prev) => ({ x, visible: true, instant: !prev.visible }));
    });
  }, []);

  function markTyping() {
    setIsTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), TYPING_PAUSE_MS);
  }

  useEffect(() => {
    const input = inputRef.current;
    const onKeyDown = () => {
      markTyping();
      updateCaret();
    };
    const caretEvents = ['input', 'keyup', 'mousedown', 'mouseup', 'focus', 'blur', 'select', 'scroll'];

    caretEvents.forEach((name) => input.addEventListener(name, updateCaret));
    input.addEventListener('keydown', onKeyDown);
    document.addEventListener('selectionchange', updateCaret);
    return () => {
      caretEvents.forEach((name) => input.removeEventListener(name, updateCaret));
      input.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('selectionchange', updateCaret);
      clearTimeout(typingTimer.current);
    };
  }, [updateCaret]);

  // The parent may change the value (e.g. clearing after submit).
  useEffect(updateCaret, [inputProps.value, updateCaret]);

  const caretClasses = [
    'caret',
    caret.visible && 'is-visible',
    caret.visible && !isTyping && 'is-blinking',
    caret.instant && 'is-instant',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className="input-wrap">
      <input ref={inputRef} className={`${className} input--smooth-caret`} {...inputProps} />
      <span className={caretClasses} style={{ transform: `translate(${caret.x}px, -50%)` }} />
    </span>
  );
}
