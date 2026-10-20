import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile.js';

export default function LazyImage({ src, alt, width, height, thumbnail = false }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setLoaded(Boolean(ref.current?.complete && ref.current.naturalWidth));
    setFailed(false);
  }, [src]);
  return (
    <div className={`image-frame ${thumbnail ? 'image-frame--thumbnail' : ''}`}
      style={{ aspectRatio: `${width} / ${height}` }} data-loaded={loaded}>
      {failed ? <span className="image-error" role="img" aria-label={`${alt}: ${profile.ui.imageError}`}>
        {profile.ui.imageError}
      </span> : <img ref={ref} src={src} alt={alt} width={width} height={height}
        loading="lazy" decoding="async" draggable="false"
        onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />}
    </div>
  );
}
