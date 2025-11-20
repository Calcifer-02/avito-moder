import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const mockProps = {
    currentPage: 2,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  it('должен отображать информацию о текущей странице', () => {
    render(<Pagination {...mockProps} />);
    expect(screen.getByText('Страница 2 из 10')).toBeInTheDocument();
  });

  it('должен отображать все кнопки навигации', () => {
    render(<Pagination {...mockProps} />);

    expect(screen.getByRole('button', { name: /Первая/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Назад/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Вперёд/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Последняя/ })).toBeInTheDocument();
  });

  it('должен вызывать onPageChange с 1 при клике на "Первая"', async () => {
    const user = userEvent.setup();
    render(<Pagination {...mockProps} />);

    const firstBtn = screen.getByRole('button', { name: /Первая/ });
    await user.click(firstBtn);

    expect(mockProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it('должен вызывать onPageChange с currentPage - 1 при клике на "Назад"', async () => {
    const user = userEvent.setup();
    render(<Pagination {...mockProps} />);

    const prevBtn = screen.getByRole('button', { name: /Назад/ });
    await user.click(prevBtn);

    expect(mockProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it('должен вызывать onPageChange с currentPage + 1 при клике на "Вперёд"', async () => {
    const user = userEvent.setup();
    render(<Pagination {...mockProps} />);

    const nextBtn = screen.getByRole('button', { name: /Вперёд/ });
    await user.click(nextBtn);

    expect(mockProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it('должен вызывать onPageChange с totalPages при клике на "Последняя"', async () => {
    const user = userEvent.setup();
    render(<Pagination {...mockProps} />);

    const lastBtn = screen.getByRole('button', { name: /Последняя/ });
    await user.click(lastBtn);

    expect(mockProps.onPageChange).toHaveBeenCalledWith(10);
  });

  it('должен блокировать "Первая" и "Назад" на первой странице', () => {
    render(<Pagination {...mockProps} currentPage={1} />);

    const firstBtn = screen.getByRole('button', { name: /Первая/ });
    const prevBtn = screen.getByRole('button', { name: /Назад/ });

    expect(firstBtn).toBeDisabled();
    expect(prevBtn).toBeDisabled();
  });

  it('должен блокировать "Вперёд" и "Последняя" на последней странице', () => {
    render(<Pagination {...mockProps} currentPage={10} />);

    const nextBtn = screen.getByRole('button', { name: /Вперёд/ });
    const lastBtn = screen.getByRole('button', { name: /Последняя/ });

    expect(nextBtn).toBeDisabled();
    expect(lastBtn).toBeDisabled();
  });

  it('не должен блокировать кнопки на средних страницах', () => {
    render(<Pagination {...mockProps} currentPage={5} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      // Исключаем информационный текст
      if (button.tagName === 'BUTTON') {
        expect(button).not.toBeDisabled();
      }
    });
  });

  it('должен корректно работать с одной страницей', () => {
    render(<Pagination {...mockProps} currentPage={1} totalPages={1} />);

    expect(screen.getByText('Страница 1 из 1')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('должен отображать корректную информацию для большого количества страниц', () => {
    render(<Pagination {...mockProps} currentPage={50} totalPages={100} />);

    expect(screen.getByText('Страница 50 из 100')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать клики на заблокированных кнопках', async () => {
    const user = userEvent.setup();
    const mockOnPageChange = vi.fn();

    render(
      <Pagination
        {...mockProps}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    );

    const firstBtn = screen.getByRole('button', { name: /Первая/ });
    await user.click(firstBtn);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('должен отображать иконки в кнопках', () => {
    const { container } = render(<Pagination {...mockProps} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(4); // По иконке на каждую кнопку
  });
});

