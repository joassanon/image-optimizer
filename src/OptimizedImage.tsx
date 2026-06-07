import { useMemo } from 'react';

const DEFAULT_WIDTHS = [320, 480, 768, 1024, 1366, 1600, 1920];

export interface OptimizedImageProps {
  src: string;
  alt?: string;
  widths?: number[];
  sizes?: string;
  quality?: number;
  format?: string;
  priority?: boolean;
  placeholder?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

const OptimizedImage = ({
  src,
  alt = '',
  widths = DEFAULT_WIDTHS,
  sizes = '100vw',
  quality = 75,
  format,
  priority = false,
  placeholder = null,
  className = '',
  style = {},
}: OptimizedImageProps) => {
  const base = '/img';

  const selected = useMemo(
    () => Array.from(new Set(widths)).sort((a, b) => a - b),
    [widths]
  );

  const srcset = selected
    .map((w: any) => {
      const params = new URLSearchParams({
        src,
        w: String(w),
        q: String(quality),
        ...(format ? { fm: format } : {}),
      });

      return `${base}?${params.toString()} ${w}w`;
    })
    .join(', ');

  const largest = selected[selected.length - 1];

  const defaultSrc = `${base}?${new URLSearchParams({
    src,
    w: String(largest),
    q: String(quality),
    ...(format ? { fm: format } : {}),
  }).toString()}`;

  if (placeholder) {
    return (
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={defaultSrc}
          srcSet={srcset}
          sizes={sizes}
          alt={alt}
          className={className}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            ...style,
          }}
          loading={priority ? 'eager' : 'lazy'}
        />

        <img
          src={placeholder}
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(20px)',
            transition: 'opacity .3s',
          }}
        />
      </div>
    );
  }

  return (
    <img
      src={defaultSrc}
      srcSet={srcset}
      sizes={sizes}
      alt={alt}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};

export default OptimizedImage;