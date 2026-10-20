// Width-growing magnification informed by alanagoyal.com (MIT).
// Resting centers keep the animation from chasing its own moving targets.
export function dockLayout(apps, iconSize = 52, buttonSize = 60) {
  let cursor = 9;
  const items = apps.map((app, index) => {
    if (index) cursor += 4;
    if (app.dividerBefore) cursor += 16;
    const correction = Number.isFinite(app.iconScale) && app.iconScale > 0 ? app.iconScale : 1;
    const slot = Math.max(buttonSize, iconSize * Math.max(1, correction) + 8);
    const center = cursor + slot / 2;
    cursor += slot;
    return { slot, center };
  });
  return { items, width: cursor + 9 };
}

export function dockMagnification(pointer, center) {
  const distance = Math.abs(pointer - center);
  return !Number.isFinite(pointer) || distance >= 120 ? 1 : 1 + .45 * (1 + Math.cos(Math.PI * distance / 120)) / 2;
}
