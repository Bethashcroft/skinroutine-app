import { useEffect, type RefObject } from 'react';

/**
 * Calls `handler` when a mousedown happens outside the referenced element.
 * Pass `enabled = false` to skip attaching the listener (e.g. when a menu is closed).
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [ref, handler, enabled]);
}
