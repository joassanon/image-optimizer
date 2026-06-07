import { render, screen } from '@testing-library/react';
import { OptimizedImage } from './index';

describe('OptimizedImage', () => {
  it('renders a responsive img element with srcset and sizes', () => {
    render(
      <OptimizedImage
        src="https://example.com/photo.jpg"
        alt="Test image"
      />
    );

    const image = screen.getByRole('img', { name: /test image/i });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
    expect(image).toHaveAttribute('srcset');
    expect(image).toHaveAttribute('sizes', '100vw');
    expect(image).toHaveAttribute('loading', 'lazy');

    expect(image.getAttribute('src')).toContain(
      'src=https%3A%2F%2Fexample.com%2Fphoto.jpg'
    );
  });

  it('uses eager loading when priority is true', () => {
    render(
      <OptimizedImage
        src="https://example.com/photo.jpg"
        alt="Priority image"
        priority
      />
    );

    const image = screen.getByRole('img', {
      name: /priority image/i,
    });

    expect(image).toHaveAttribute('loading', 'eager');
  });

  it('includes format and quality parameters in generated urls', () => {
    render(
      <OptimizedImage
        src="https://example.com/photo.jpg"
        alt="Formatted image"
        format="webp"
        quality={90}
      />
    );

    const image = screen.getByRole('img', {
      name: /formatted image/i,
    });

    const src = image.getAttribute('src') ?? '';

    expect(src).toContain('fm=webp');
    expect(src).toContain('q=90');
  });

  it('renders a blurred placeholder overlay when placeholder is provided', () => {
    const placeholderUrl = 'https://example.com/placeholder.jpg';

    render(
      <OptimizedImage
        src="https://example.com/photo.jpg"
        alt="Placeholder image"
        placeholder={placeholderUrl}
      />
    );

    const mainImage = screen.getByRole('img', {
      name: /placeholder image/i,
    });

    expect(mainImage).toBeInTheDocument();

    const allImages = screen.getAllByRole('img', {
      hidden: true,
    });

    expect(allImages).toHaveLength(2);

    const placeholderImage = allImages.find(
      img => img.getAttribute('src') === placeholderUrl
    );

    expect(placeholderImage).toBeInTheDocument();
    expect(placeholderImage).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses custom sizes when provided', () => {
    render(
      <OptimizedImage
        src="https://example.com/photo.jpg"
        alt="Custom sizes image"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );

    const image = screen.getByRole('img', {
      name: /custom sizes image/i,
    });

    expect(image).toHaveAttribute(
      'sizes',
      '(max-width: 768px) 100vw, 50vw'
    );
  });

  it('uses custom widths to generate srcset', () => {
    render(
      <OptimizedImage
        src="https://example.com/photo.jpg"
        alt="Custom widths image"
        widths={[400, 800]}
      />
    );

    const image = screen.getByRole('img', {
      name: /custom widths image/i,
    });

    const srcset = image.getAttribute('srcset') ?? '';

    expect(srcset).toContain('w=400');
    expect(srcset).toContain('400w');

    expect(srcset).toContain('w=800');
    expect(srcset).toContain('800w');
  });

  it('removes duplicate widths and sorts them', () => {
    render(
      <OptimizedImage
        src="https://example.com/photo.jpg"
        alt="Sorted widths image"
        widths={[1024, 320, 1024, 768]}
      />
    );

    const image = screen.getByRole('img', {
      name: /sorted widths image/i,
    });

    const srcset = image.getAttribute('srcset') ?? '';

    expect(srcset.match(/1024w/g)).toHaveLength(1);

    const index320 = srcset.indexOf('320w');
    const index768 = srcset.indexOf('768w');
    const index1024 = srcset.indexOf('1024w');

    expect(index320).toBeLessThan(index768);
    expect(index768).toBeLessThan(index1024);
  });
});