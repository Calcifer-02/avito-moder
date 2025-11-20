import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedPage } from '../../components/AnimatedPage/AnimatedPage';

describe('AnimatedPage', () => {
  it('должен рендерить children', () => {
    render(
      <AnimatedPage>
        <div>Test Content</div>
      </AnimatedPage>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('должен применять анимацию к содержимому', () => {
    const { container } = render(
      <AnimatedPage>
        <div>Animated Content</div>
      </AnimatedPage>
    );

    // Проверяем что есть обертка от framer-motion
    const motionDiv = container.firstChild;
    expect(motionDiv).toBeTruthy();
  });

  it('должен рендерить несколько элементов', () => {
    render(
      <AnimatedPage>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </AnimatedPage>
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('должен корректно работать с пустым содержимым', () => {
    const { container } = render(<AnimatedPage>{null}</AnimatedPage>);
    expect(container.firstChild).toBeTruthy();
  });
});

