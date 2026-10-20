import { useCallback, useEffect, useReducer } from 'react';

export const fileSessionKey = 'perdana.files.v1';
export const emptyFileState = { trashed: [], removed: [] };

export function projectFilesReducer(state, action) {
  if (action.type === 'trash') {
    if (state.trashed.includes(action.id) || state.removed.includes(action.id)) return state;
    return { ...state, trashed: [...state.trashed, action.id] };
  }
  if (action.type === 'restore') return { ...state, trashed: state.trashed.filter(id => id !== action.id) };
  if (action.type === 'restore-all') return { ...state, trashed: [] };
  if (action.type === 'empty') return { trashed: [], removed: [...new Set([...state.removed, ...state.trashed])] };
  return state;
}

export function useProjectFiles(projects) {
  const [state, dispatch] = useReducer(projectFilesReducer, projects, items => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(fileSessionKey));
      const valid = new Set(items.map(item => item.id));
      if (stored && Array.isArray(stored.trashed) && Array.isArray(stored.removed)) {
        const removed = [...new Set(stored.removed.filter(id => valid.has(id)))];
        return { removed, trashed: [...new Set(stored.trashed.filter(id => valid.has(id) && !removed.includes(id)))] };
      }
    } catch { /* Storage may be unavailable; memory-only operation still works. */ }
    return emptyFileState;
  });
  useEffect(() => {
    try { sessionStorage.setItem(fileSessionKey, JSON.stringify(state)); } catch { /* Memory fallback. */ }
  }, [state]);
  const trash = useCallback(id => { if (projects.some(item => item.id === id)) dispatch({ type: 'trash', id }); }, [projects]);
  const restore = useCallback(id => dispatch({ type: 'restore', id }), []);
  const restoreAll = useCallback(() => dispatch({ type: 'restore-all' }), []);
  const empty = useCallback(() => dispatch({ type: 'empty' }), []);
  return {
    available: projects.filter(item => !state.trashed.includes(item.id) && !state.removed.includes(item.id)),
    trashed: projects.filter(item => state.trashed.includes(item.id)),
    trash, restore, restoreAll, empty,
  };
}
