import { usePointerDrag } from './usePointerDrag.js';
import { desktopBounds, resizeFrame } from '../utils/geometry.js';

export const resizeEdges = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

export function useWindowResize({ enabled, read, apply, settle, commit, minimum }) {
  const drag = usePointerDrag({
    enabled,
    start: event => {
      settle();
      return { frame: read(), edge: event.currentTarget.dataset.edge };
    },
    move: ({ dx, dy, origin }) => apply(resizeFrame(origin.frame, origin.edge, dx, dy, desktopBounds(), minimum)),
    end: ({ moved, cancelled, origin }) => {
      if (cancelled) apply(origin.frame);
      else if (moved) commit(read());
    },
  });
  return {
    ...drag.handlers,
    onKeyDown(event) {
      if (!enabled || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      settle();
      const amount = event.shiftKey ? 40 : 10;
      const dx = event.key === 'ArrowLeft' ? -amount : event.key === 'ArrowRight' ? amount : 0;
      const dy = event.key === 'ArrowUp' ? -amount : event.key === 'ArrowDown' ? amount : 0;
      const next = resizeFrame(read(), event.currentTarget.dataset.edge, dx, dy, desktopBounds(), minimum);
      apply(next); commit(next);
    },
  };
}
