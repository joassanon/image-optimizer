# @joassanon/optimized-image

A lightweight React image component for responsive image delivery using query-based optimization.

It builds `srcset` and `sizes` automatically, renders a modern `img` element, and can optionally overlay a blurred placeholder image.

> Note: This package currently assumes your image optimization endpoint is available at `/img` and uses query parameters `src`, `w`, `q`, and `fm`.

## Features

- Responsive image `srcset` generation from width presets
- Automatic `sizes` support for fluid layouts
- Lazy loading by default, eager loading when `priority` is enabled
- Optional blurred placeholder overlay
- Built for React 18+ with TypeScript support

## Installation

```bash
npm install @joassanon/optimized-image
```

or

```bash
yarn add @joassanon/optimized-image
```

## Usage

```tsx
import { OptimizedImage } from '@joassanon/optimized-image';

export default function Example() {
  return (
    <OptimizedImage
      src="https://example.com/photo.jpg"
      alt="A responsive optimized photo"
      widths={[320, 640, 960, 1280, 1600]}
      sizes="(max-width: 768px) 100vw, 50vw"
      quality={80}
      format="webp"
      priority={false}
      placeholder="https://example.com/photo-placeholder.jpg"
      className="responsive-image"
      style={{ borderRadius: '8px' }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | required | Source image URL passed to the optimizer endpoint |
| `alt` | `string` | `''` | Alternative text for the image |
| `widths` | `number[]` | `[320, 480, 768, 1024, 1366, 1600, 1920]` | List of widths used to generate `srcset` |
| `sizes` | `string` | `100vw` | Value for the image `sizes` attribute |
| `quality` | `number` | `75` | Image quality setting used by the optimizer endpoint |
| `format` | `string` | `undefined` | Optional output format, appended as `fm` query parameter |
| `priority` | `boolean` | `false` | When `true`, uses `loading="eager"` |
| `placeholder` | `string  null` | `null` | Optional placeholder image URL rendered on top with blur |
| `className` | `string` | `''` | CSS class name for the rendered image |
| `style` | `React.CSSProperties` | `{}` | Inline styles for the rendered image |

## How it works

The component builds an optimized image URL using the internal base path `/img` and appends the following query parameters:

- `src` — source image URL
- `w` — requested image width
- `q` — requested image quality
- `fm` — optional output format

It renders a normal `<img>` tag with both `src` and `srcSet` attributes so the browser can choose the best size.

When `placeholder` is provided, the component renders a second absolutely positioned blurred image overlay for better progressive loading.

## Build

This repository uses Rollup to generate CommonJS and ES module bundles.

```bash
npm run build
```

## Peer dependencies

- `react@>=18`
- `react-dom@>=18`

## License

Add your license information here.
