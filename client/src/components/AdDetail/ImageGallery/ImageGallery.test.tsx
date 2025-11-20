import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageGallery } from './ImageGallery';

describe('ImageGallery', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];
  const mockTitle = 'Test Product';

  it('должен рендерить главное изображение', () => {
    render(
      <ImageGallery
        images={mockImages}
        title={mockTitle}
        priority="normal"
        currentIndex={0}
        onImageChange={() => {}}
      />
    );

    const mainImage = screen.getByAltText(mockTitle);
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', mockImages[0]);
  });

  it('должен рендерить все миниатюры', () => {
    render(
      <ImageGallery
        images={mockImages}
        title={mockTitle}
        priority="normal"
        currentIndex={0}
        onImageChange={() => {}}
      />
    );

    mockImages.forEach((_, index) => {
      const thumbnail = screen.getByAltText(`${mockTitle} ${index + 1}`);
      expect(thumbnail).toBeInTheDocument();
    });
  });

  it('должен показывать бейдж срочности для срочных объявлений', () => {
    render(
      <ImageGallery
        images={mockImages}
        title={mockTitle}
        priority="urgent"
        currentIndex={0}
        onImageChange={() => {}}
      />
    );

    expect(screen.getByText('Срочное')).toBeInTheDocument();
  });

  it('не должен показывать бейдж срочности для обычных объявлений', () => {
    render(
      <ImageGallery
        images={mockImages}
        title={mockTitle}
        priority="normal"
        currentIndex={0}
        onImageChange={() => {}}
      />
    );

    expect(screen.queryByText('Срочное')).not.toBeInTheDocument();
  });

  it('должен вызывать onImageChange при клике на миниатюру', () => {
    const mockOnChange = vi.fn();
    render(
      <ImageGallery
        images={mockImages}
        title={mockTitle}
        priority="normal"
        currentIndex={0}
        onImageChange={mockOnChange}
      />
    );

    const secondThumbnail = screen.getByAltText(`${mockTitle} 2`);
    secondThumbnail.closest('div')?.click();

    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it('должен отображать правильное изображение по currentIndex', () => {
    const { rerender } = render(
      <ImageGallery
        images={mockImages}
        title={mockTitle}
        priority="normal"
        currentIndex={0}
        onImageChange={() => {}}
      />
    );

    let mainImage = screen.getByAltText(mockTitle);
    expect(mainImage).toHaveAttribute('src', mockImages[0]);

    rerender(
      <ImageGallery
        images={mockImages}
        title={mockTitle}
        priority="normal"
        currentIndex={2}
        onImageChange={() => {}}
      />
    );

    mainImage = screen.getByAltText(mockTitle);
    expect(mainImage).toHaveAttribute('src', mockImages[2]);
  });

  it('должен работать с одним изображением', () => {
    const singleImage = ['https://example.com/single.jpg'];
    render(
      <ImageGallery
        images={singleImage}
        title={mockTitle}
        priority="normal"
        currentIndex={0}
        onImageChange={() => {}}
      />
    );

    expect(screen.getByAltText(mockTitle)).toBeInTheDocument();
    expect(screen.getByAltText(`${mockTitle} 1`)).toBeInTheDocument();
  });
});

