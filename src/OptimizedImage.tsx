import { useMemo } from 'react';

const DEFAULT_WIDTHS = [320, 480, 768, 1024, 1366, 1600, 1920];

/**
 * Default width values used to generate normalized responsive `srcset` entries.
 * @type {number[]}
 */

export interface OptimizedImageProps {
  /** Source image path passed to the optimizer endpoint. */
  src: string;
  /** Alternative text for the image. */
  alt?: string;
  /** Width values used to build the `srcset`. */
  widths?: number[];
  /** `sizes` attribute value for responsive image selection. */
  sizes?: string;
  /** Quality value forwarded to the image optimizer. */
  quality?: number;
  /** Optional output format name forwarded as `fm`. */
  format?: string;
  /** When true, the rendered image uses eager loading. */
  priority?: boolean;
  /** Optional placeholder image URL shown in a blurred overlay. */
  placeholder?: string | null;
  /** CSS class names applied to the rendered image. */
  className?: string;
  /** Inline styles applied to the rendered image. */
  style?: React.CSSProperties;
}

/**
 * A responsive image component that builds optimized `/img` query URLs for multiple widths.
 *
 * @param {OptimizedImageProps} props
 * @returns {JSX.Element}
 */
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