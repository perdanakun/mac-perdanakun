import { useState } from 'react';

export default function Wallpaper({ wallpaper }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const source = wallpaper.desktop || wallpaper.mobile;
  return (
    <div className="wallpaper" aria-hidden="true" data-loaded={loaded && !failed}
      style={{ '--wallpaper-color': wallpaper.placeholderColor,
        '--wallpaper-position-desktop': wallpaper.desktopPosition,
        '--wallpaper-position-mobile': wallpaper.mobilePosition }}>
      {source && <picture>
        <source media="(max-width: 768px)" srcSet={wallpaper.mobile || source} />
        <img src={source} alt="" fetchPriority="high" decoding="async"
          onLoad={() => { setLoaded(true); setFailed(false); }}
          onError={() => setFailed(true)} />
      </picture>}
    </div>
  );
}
