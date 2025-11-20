import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';

describe('HeroSection', () => {
  it('должен рендерить заголовок', () => {
    render(
      <HeroSection
        title="Тестовый заголовок"
        subtitle="Тестовый подзаголовок"
      />
    );

    expect(screen.getByText('Тестовый заголовок')).toBeInTheDocument();
  });

  it('должен рендерить подзаголовок', () => {
    render(
      <HeroSection
        title="Заголовок"
        subtitle="Подзаголовок для проверки"
      />
    );

    expect(screen.getByText('Подзаголовок для проверки')).toBeInTheDocument();
  });

  it('должен отображать изображение если передан imageSrc', () => {
    render(
      <HeroSection
        title="Заголовок"
        subtitle="Подзаголовок"
        imageSrc="test-image.svg"
      />
    );

    const image = screen.getByAltText('Avito Tech Layer');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.svg');
  });

  it('не должен отображать изображение если imageSrc не передан', () => {
    render(
      <HeroSection
        title="Заголовок"
        subtitle="Подзаголовок"
      />
    );

    expect(screen.queryByAltText('Avito Tech Layer')).not.toBeInTheDocument();
  });

  it('должен отображать оба текстовых элемента одновременно', () => {
    render(
      <HeroSection
        title="Модерация объявлений"
        subtitle="Управление и проверка объявлений"
        imageSrc="layer.svg"
      />
    );

    expect(screen.getByText('Модерация объявлений')).toBeInTheDocument();
    expect(screen.getByText('Управление и проверка объявлений')).toBeInTheDocument();
    expect(screen.getByAltText('Avito Tech Layer')).toBeInTheDocument();
  });
});

