import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BulkActionsPanel } from './BulkActionsPanel';

describe('BulkActionsPanel', () => {
  const mockProps = {
    selectedCount: 5,
    isProcessing: false,
    onSelectAll: vi.fn(),
    onClearSelection: vi.fn(),
    onApprove: vi.fn(),
    onReject: vi.fn(),
  };

  it('должен отображать количество выбранных элементов', () => {
    render(<BulkActionsPanel {...mockProps} />);
    expect(screen.getByText('Выбрано:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('должен отображать кнопку "Выбрать все на странице"', () => {
    render(<BulkActionsPanel {...mockProps} />);
    expect(screen.getByRole('button', { name: 'Выбрать все на странице' })).toBeInTheDocument();
  });

  it('должен отображать кнопку "Снять выделение"', () => {
    render(<BulkActionsPanel {...mockProps} />);
    expect(screen.getByRole('button', { name: 'Снять выделение' })).toBeInTheDocument();
  });

  it('должен отображать кнопку "Одобрить выбранные"', () => {
    render(<BulkActionsPanel {...mockProps} />);
    expect(screen.getByRole('button', { name: 'Одобрить выбранные' })).toBeInTheDocument();
  });

  it('должен отображать кнопку "Отклонить выбранные"', () => {
    render(<BulkActionsPanel {...mockProps} />);
    expect(screen.getByRole('button', { name: 'Отклонить выбранные' })).toBeInTheDocument();
  });

  it('должен вызывать onSelectAll при клике на "Выбрать все на странице"', async () => {
    const user = userEvent.setup();
    render(<BulkActionsPanel {...mockProps} />);

    const selectAllBtn = screen.getByRole('button', { name: 'Выбрать все на странице' });
    await user.click(selectAllBtn);

    expect(mockProps.onSelectAll).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать onClearSelection при клике на "Снять выделение"', async () => {
    const user = userEvent.setup();
    render(<BulkActionsPanel {...mockProps} />);

    const clearBtn = screen.getByRole('button', { name: 'Снять выделение' });
    await user.click(clearBtn);

    expect(mockProps.onClearSelection).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать onApprove при клике на "Одобрить выбранные"', async () => {
    const user = userEvent.setup();
    render(<BulkActionsPanel {...mockProps} />);

    const approveBtn = screen.getByRole('button', { name: 'Одобрить выбранные' });
    await user.click(approveBtn);

    expect(mockProps.onApprove).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать onReject при клике на "Отклонить выбранные"', async () => {
    const user = userEvent.setup();
    render(<BulkActionsPanel {...mockProps} />);

    const rejectBtn = screen.getByRole('button', { name: 'Отклонить выбранные' });
    await user.click(rejectBtn);

    expect(mockProps.onReject).toHaveBeenCalledTimes(1);
  });

  it('должен блокировать кнопки действий во время обработки', () => {
    render(<BulkActionsPanel {...mockProps} isProcessing={true} />);

    const processingButtons = screen.getAllByRole('button', { name: 'Обработка...' });
    expect(processingButtons).toHaveLength(2);
    expect(processingButtons[0]).toBeDisabled();
    expect(processingButtons[1]).toBeDisabled();
  });

  it('должен отображать текст "Обработка..." во время обработки', () => {
    render(<BulkActionsPanel {...mockProps} isProcessing={true} />);

    const processingButtons = screen.getAllByText('Обработка...');
    expect(processingButtons).toHaveLength(2); // Одобрить и Отклонить
  });

  it('не должен вызывать callbacks если кнопки заблокированы', async () => {
    const user = userEvent.setup();
    const mockOnApprove = vi.fn();
    const mockOnReject = vi.fn();

    render(
      <BulkActionsPanel
        {...mockProps}
        isProcessing={true}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const processingButtons = screen.getAllByRole('button', { name: 'Обработка...' });
    await user.click(processingButtons[0]);

    expect(mockOnApprove).not.toHaveBeenCalled();
  });

  it('должен отображать правильное количество выбранных для 1 элемента', () => {
    render(<BulkActionsPanel {...mockProps} selectedCount={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('должен отображать правильное количество выбранных для большого числа', () => {
    render(<BulkActionsPanel {...mockProps} selectedCount={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('должен иметь правильную структуру кнопок', () => {
    render(<BulkActionsPanel {...mockProps} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4); // Выбрать все, Снять выделение, Одобрить, Отклонить
  });
});

