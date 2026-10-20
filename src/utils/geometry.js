export const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));

export function desktopBounds() {
  const menu = document.querySelector('[data-menu-bar]')?.getBoundingClientRect();
  const dock = document.querySelector('[data-dock]')?.getBoundingClientRect();
  return {
    left: 12,
    top: (menu?.bottom ?? 28) + 12,
    right: window.innerWidth - 12,
    bottom: Math.max((menu?.bottom ?? 28) + 100, (dock?.top ?? window.innerHeight - 90) - 16),
  };
}

export function fitFrame(frame) {
  const bounds = desktopBounds();
  const width = Math.min(frame.width, bounds.right - bounds.left);
  const height = Math.min(frame.height, bounds.bottom - bounds.top);
  return {
    width, height,
    x: clamp(frame.x, bounds.left, bounds.right - width),
    y: clamp(frame.y, bounds.top, bounds.bottom - height),
  };
}

export function initialFrame(kind, index) {
  const bounds = desktopBounds();
  const width = Math.min(kind === 'mail' ? 520 : kind === 'notes' ? 860 : kind === 'gallery' ? 980 : kind === 'trash' ? 720 : 900, bounds.right - bounds.left);
  const height = Math.min(kind === 'mail' ? 440 : kind === 'gallery' ? 680 : 650, bounds.bottom - bounds.top);
  const offset = (index % 4) * 22;
  return fitFrame({
    x: (window.innerWidth - width) / 2 + offset,
    y: bounds.top + 12 + offset,
    width, height,
  });
}

export const viewportFrame = () => ({ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight });

// Fixed opposite edges; the minimum shrinks when the viewport itself is smaller.
export function resizeFrame(frame, edge, dx, dy, bounds, minimum = { width: 360, height: 240 }) {
  const minW = Math.min(minimum.width, bounds.right - bounds.left);
  const minH = Math.min(minimum.height, bounds.bottom - bounds.top);
  const base = {
    width: clamp(frame.width, minW, bounds.right - bounds.left),
    height: clamp(frame.height, minH, bounds.bottom - bounds.top),
  };
  base.x = clamp(frame.x, bounds.left, bounds.right - base.width);
  base.y = clamp(frame.y, bounds.top, bounds.bottom - base.height);
  let left = base.x, top = base.y, right = left + base.width, bottom = top + base.height;
  if (edge.includes('w')) left = clamp(left + dx, bounds.left, right - minW);
  if (edge.includes('e')) right = clamp(right + dx, left + minW, bounds.right);
  if (edge.includes('n')) top = clamp(top + dy, bounds.top, bottom - minH);
  if (edge.includes('s')) bottom = clamp(bottom + dy, top + minH, bounds.bottom);
  return { x: left, y: top, width: right - left, height: bottom - top };
}

export function rectOf(element) {
  if (!element?.isConnected) return null;
  const { left: x, top: y, width, height } = element.getBoundingClientRect();
  return { x, y, width, height };
}

// Keep artwork proportional while the window travels to its originating icon.
export function collapseTransform(source, frame) {
  if (!source) return { x: 0, y: 12, scale: .96, opacity: 0 };
  const scale = Math.max(.02, Math.min(source.width / frame.width, source.height / frame.height, 1));
  return {
    x: source.x + (source.width - frame.width * scale) / 2 - frame.x,
    y: source.y + (source.height - frame.height * scale) / 2 - frame.y,
    scale,
    opacity: 0,
  };
}
