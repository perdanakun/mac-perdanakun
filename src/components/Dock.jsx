import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useAnimationControls, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { profile } from '../data/profile.js';
import { dockLayout, dockMagnification } from '../utils/dockLayout.js';

function DockItem({ app, pointer, geometry, iconSize, mobile, open, onOpen }) {
  const reduced = useReducedMotion();
  const bounce = useAnimationControls();
  const [failedIcon, setFailedIcon] = useState(null);
  const custom = Boolean(app.icon && failedIcon !== app.icon);
  const correction = mobile ? app.iconScaleMobile ?? app.iconScale : app.iconScale;
  const artScale = custom && Number.isFinite(correction) && correction > 0 ? correction : 1;
  const target = useTransform(pointer, value => mobile || reduced ? 1 : dockMagnification(value, geometry.center));
  const magnification = useSpring(target, { stiffness: 460, damping: 30, mass: .45 });
  const slotWidth = useTransform(magnification, value => geometry.slot * value);
  const imageSize = useTransform(magnification, value => iconSize * value);
  return (
    <li className="dock-item" data-divider={app.dividerBefore || undefined}
      style={mobile ? { minWidth: Math.max(44, iconSize * artScale + 4) } : undefined}>
      <motion.button type="button" className="dock-button" aria-label={app.label} aria-haspopup="dialog"
        style={mobile ? undefined : { width: slotWidth }}
        onClick={event => {
          if (!reduced) void bounce.start({ y: [0, mobile ? -8 : -14, 0], transition: { duration: .38, ease: ['easeOut', 'easeIn'] } });
          onOpen(app, event.currentTarget);
        }}>
        <motion.span className="dock-icon-scale" style={mobile ? undefined : { width: imageSize, height: imageSize }}>
          <span className="dock-icon-art" style={{ '--dock-art-scale': artScale }}>
            <motion.img src={custom ? app.icon : app.fallbackIcon} alt="" width="64" height="64" draggable="false"
              animate={bounce} onError={() => setFailedIcon(app.icon)} />
          </span>
        </motion.span>
        <span className="dock-label" aria-hidden="true">{app.label}</span>
        <span className="dock-dot" data-open={open} aria-hidden="true" />
      </motion.button>
    </li>
  );
}

export default function Dock({ apps, mobile, openIds, onOpen }) {
  const ref = useRef(null);
  const pointer = useMotionValue(Infinity);
  const [metrics, setMetrics] = useState({ icon: 52, button: 60 });
  useLayoutEffect(() => {
    const update = () => {
      pointer.set(Infinity);
      const css = getComputedStyle(ref.current);
      setMetrics({ icon: parseFloat(css.getPropertyValue('--dock-icon-size')) || 52,
        button: parseFloat(css.getPropertyValue('--dock-button-width')) || 60 });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [mobile, pointer]);
  const layout = dockLayout(apps, metrics.icon, metrics.button);
  return (
    <nav ref={ref} className="dock" data-dock aria-label={profile.ui.dock}
      onPointerMove={event => {
        if (mobile || event.pointerType !== 'mouse') return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.set((event.clientX - rect.left) / rect.width * layout.width);
      }} onPointerLeave={() => pointer.set(Infinity)}>
      <ul>{apps.map((app, index) => <DockItem key={app.id} app={app} pointer={pointer}
        geometry={layout.items[index]} iconSize={metrics.icon} mobile={mobile}
        open={openIds.has(app.id)} onOpen={onOpen} />)}</ul>
    </nav>
  );
}
