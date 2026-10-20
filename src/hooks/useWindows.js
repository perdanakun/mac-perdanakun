import { useCallback, useReducer } from 'react';
import { initialFrame, rectOf } from '../utils/geometry.js';

// Array order is the stacking order. IDs stay stable when restored.
export function windowsReducer(windows, action) {
  const target = windows.find(item => item.id === action.id);
  switch (action.type) {
    case 'open':
      return [...windows.filter(item => item.id !== action.item.id).map(item => item.maximized && !item.minimized ? { ...item, maximized: false } : item), {
        ...(windows.find(item => item.id === action.item.id) ?? action.item),
        origin: action.item.origin,
        trigger: action.item.trigger,
        minimized: false,
      }];
    case 'focus':
      if (!target || windows.at(-1)?.id === action.id) return windows;
      return [...windows.filter(item => item.id !== action.id).map(item => item.maximized && !item.minimized ? { ...item, maximized: false } : item), target];
    case 'close':
      return windows.filter(item => item.id !== action.id);
    case 'minimize':
      return windows.map(item => item.id === action.id ? { ...item, minimized: true } : item);
    case 'zoom':
      return windows.map(item => item.id === action.id ? { ...item, maximized: !item.maximized } : item);
    case 'move':
      return windows.map(item => item.id === action.id ? { ...item, frame: action.frame } : item);
    default:
      return windows;
  }
}

export function useWindows() {
  const [windows, dispatch] = useReducer(windowsReducer, []);
  const open = useCallback((item, trigger) => {
    dispatch({ type: 'open', item: {
      ...item,
      frame: initialFrame(item.kind, windows.length),
      origin: rectOf(trigger),
      trigger,
      minimized: false,
      maximized: false,
    } });
  }, [windows.length]);
  const close = useCallback(id => dispatch({ type: 'close', id }), []);
  const focus = useCallback(id => dispatch({ type: 'focus', id }), []);
  const minimize = useCallback(id => dispatch({ type: 'minimize', id }), []);
  const zoom = useCallback(id => dispatch({ type: 'zoom', id }), []);
  const move = useCallback((id, frame) => dispatch({ type: 'move', id, frame }), []);

  return {
    windows, open, close, focus, minimize, zoom, move,
    activeId: windows.filter(item => !item.minimized).at(-1)?.id ?? null,
  };
}
