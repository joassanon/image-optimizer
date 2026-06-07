import { render, screen } from '@testing-library/react';
import { OptimizedImage } from './index';

describe('OptimizedImage', () => {
  it('renders a responsive img element with srcset and sizes', () => {
    render(<OptimizedImage src="https://example.com/photo.jpg" alt="Test image" />);

    const image = screen.getByRole('img', { name: /test image/i });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
    expect(image).toHaveAttribute('srcset');
    expect(image).toHaveAttribute('sizes', '100vw');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image.getAttribute('src')).toContain('src=https%3A%2F%2Fexample.com%2Fphoto.jpg');
  });

  it('uses eager loading when priority is true', () => {
    render(<OptimizedImage src="https://example.com/photo.jpg" alt="Priority image" priority />);

    const image = screen.getByRole('img', { name: /priority image/i });
    expect(image).toHaveAttribute('loading', 'eager');
  });

  it('renders a blurred placeholder overlay when placeholder is provided', () => {
    render(
      <OptimizedImage
        src="https://example.com/photo.jpg"
        alt="Placeholder image"
        placeholder="https://example.com/placeholder.jpg"
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[1]).toHaveAttribute('src', 'https://example.com/placeholder.jpg');
    expect(images[1]).toHaveAttribute('aria-hidden', 'true');
  });
});
