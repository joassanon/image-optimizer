# Image Optimizer / Optimized Image

This repository contains two related packages:

- `@joassanon/optimized-image` — a React component for responsive optimized image delivery
- `joassanon/image-optimizer` — a Laravel image optimization endpoint that serves `/img`

The React component is built to work with the Laravel backend in the same repository. It generates responsive `srcset`/`sizes` markup and calls `/img` with query parameters.

## What is included

- `src/OptimizedImage.tsx` — React component
- `src/index.ts` — package exports
- `src/OptimizedImage.test.tsx` — Vitest-powered test suite
- `composer.json` + Laravel service provider + controller — backend endpoint implementation

## Installation

### React package

```bash
npm install @joassanon/optimized-image
```

or

```bash
yarn add @joassanon/optimized-image
```

### Laravel backend

Install the Laravel package as a dependency:

```bash
composer require joassanon/image-optimizer
```

If your Laravel app does not auto-discover providers, register it manually:

```php
Vendor\\ImageOptimizer\\ImageOptimizerServiceProvider::class,
```

Publish config if required:

```bash
php artisan vendor:publish --provider="Vendor\\ImageOptimizer\\ImageOptimizerServiceProvider" --tag=config
```

## Backend endpoint

The backend exposes a single route at `/img`.

Supported query params:

- `src` — local image path, e.g. `images/products/shoe.jpg`
- `w` — width in pixels
- `q` — quality (10–95)
- `fm` — optional output format (`webp`, `avif`, `png`, `jpeg`)
- `fit` — optional fit mode, defaults to `max`

> Important: the current Laravel endpoint only accepts `src` values beginning with `images/` and expects the file to exist on the configured filesystem disk.

## React usage

```tsx
import { OptimizedImage } from '@joassanon/optimized-image';

export default function ProductImage() {
  return (
    <OptimizedImage
      src="images/products/shoe.jpg"
      alt="Running shoe"
      widths={[320, 640, 960, 1280]}
      sizes="(max-width: 768px) 100vw, 50vw"
      quality={80}
      format="webp"
      priority={false}
      placeholder="images/products/shoe-blur.jpg"
      className="responsive-image"
      style={{ borderRadius: '8px' }}
    />
  );
}
```

### Notes

- `src` should be a local storage path, not an external URL, when using the bundled Laravel backend.
- The component builds `/img?src=...&w=...&q=...` for each width.
- If `format` is omitted, the backend negotiates the format from the browser `Accept` header.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | required | Local image path passed to `/img`, e.g. `images/photo.jpg` |
| `alt` | `string` | `''` | Alternative text for the image |
| `widths` | `number[]` | `[320, 480, 768, 1024, 1366, 1600, 1920]` | Widths used to generate `srcset` |
| `sizes` | `string` | `100vw` | Value for the `sizes` attribute |
| `quality` | `number` | `75` | Optimizer quality setting |
| `format` | `string` | `undefined` | Optional output format sent as `fm` |
| `priority` | `boolean` | `false` | When `true`, uses `loading="eager"` |
| `placeholder` | `string | null` | `null` | Optional blurred placeholder image URL |
| `className` | `string` | `''` | CSS class name for the rendered image |
| `style` | `React.CSSProperties` | `{}` | Inline styles for the rendered image |

## Build & test

```bash
npm install
npm run build
npm test
```

## Peer dependencies

- `react@>=18`
- `react-dom@>=18`

## License

MIT
