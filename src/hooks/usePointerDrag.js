import { useRef } from 'react';

// MotionValues handle movement without re-rendering on every pointer event.
export function usePointerDrag({ enabled = true, start, move, end }) {
  const gesture = useRef(null);
  const dragged = useRef(false);

  function finish(event, cancelled = false) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    end?.({ moved: dragged.current, cancelled, origin: current.origin });
  }

  return {
    dragged,
    handlers: {
      onPointerDown(event) {
        if (!enabled || event.button !== 0 || gesture.current) return;
        dragged.current = false;
        gesture.current = {
          id: event.pointerId, x: event.clientX, y: event.clientY,
          origin: start(event),
        };
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove(event) {
        const current = gesture.current;
        if (!current || current.id !== event.pointerId) return;
        const dx = event.clientX - current.x;
        const dy = event.clientY - current.y;
        if (!dragged.current && Math.hypot(dx, dy) < 5) return;
        dragged.current = true;
        move({ dx, dy, origin: current.origin });
      },
      onPointerUp: event => finish(event),
      onPointerCancel: event => finish(event, true),
      onLostPointerCapture: event => finish(event, true),
    },
  };
}
