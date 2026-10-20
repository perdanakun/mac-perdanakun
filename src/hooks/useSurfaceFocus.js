import { useEffect, useRef } from 'react';

const focusable = 'button:not(:disabled), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useSurfaceFocus(ref, { active, modal = false, onClose, restoreTarget }) {
  const close = useRef(onClose);
  const restore = useRef(restoreTarget);
  close.current = onClose;
  restore.current = restoreTarget;

  // Restore the opener only when focus has actually been lost on unmount.
  useEffect(() => {
    const opener = document.activeElement;
    return () => queueMicrotask(() => {
      const target = restore.current?.isConnected ? restore.current : opener;
      if (document.activeElement === document.body && target?.isConnected && !target.closest('[inert]')) {
        target.focus({ preventScroll: true });
      }
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    const root = ref.current;
    const getItems = () => [...root.querySelectorAll(focusable)]
      .filter(node => node.getClientRects().length && !node.closest('[inert]'));
    const first = () => root.querySelector('[data-autofocus]') ?? getItems()[0] ?? root;
    const frame = requestAnimationFrame(() => {
      if (!root.contains(document.activeElement)) first().focus({ preventScroll: true });
    });
    function keydown(event) {
      if (event.defaultPrevented || event.isComposing) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close.current();
      }
      if (!modal || event.key !== 'Tab') return;
      const items = getItems();
      const current = items.indexOf(document.activeElement);
      if (!items.length) {
        event.preventDefault(); root.focus();
      } else if (event.shiftKey && current <= 0) {
        event.preventDefault(); items.at(-1).focus();
      } else if (!event.shiftKey && (current === items.length - 1 || current === -1)) {
        event.preventDefault(); items[0].focus();
      }
    }
    const keepFocus = event => {
      if (modal && !root.contains(event.target)) first().focus({ preventScroll: true });
    };
    document.addEventListener('keydown', keydown);
    document.addEventListener('focusin', keepFocus);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('focusin', keepFocus);
    };
  }, [active, modal, ref]);
}
