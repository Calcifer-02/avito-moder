import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BulkRejectModal } from './BulkRejectModal';
import type { RejectReason } from '../../../types';

describe('BulkRejectModal', () => {
  const mockProps = {
    isOpen: true,
    selectedCount: 5,
    reason: '' as RejectReason | '',
    comment: '',
    isProcessing: false,
    onReasonChange: vi.fn(),
    onCommentChange: vi.fn(),
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('не должен рендериться если isOpen = false', () => {
    render(<BulkRejectModal {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Отклонение объявлений')).not.toBeInTheDocument();
  });

  it('должен рендериться если isOpen = true', () => {
    render(<BulkRejectModal {...mockProps} />);
    expect(screen.getByText('Отклонение объявлений')).toBeInTheDocument();
  });

  it('должен отображать количество выбранных объявлений', () => {
    render(<BulkRejectModal {...mockProps} selectedCount={5} />);
    expect(screen.getByText(/Вы собираетесь отклонить 5 объявлений/)).toBeInTheDocument();
  });

  it('должен отображать селект с причинами', () => {
    render(<BulkRejectModal {...mockProps} />);
    expect(screen.getByText('Причина отклонения')).toBeInTheDocument();
    expect(screen.getByText('Выберите причину')).toBeInTheDocument();
  });

  it('должен отображать все причины отклонения', () => {
    render(<BulkRejectModal {...mockProps} />);

    expect(screen.getByText('Запрещенный товар')).toBeInTheDocument();
    expect(screen.getByText('Неверная категория')).toBeInTheDocument();
    expect(screen.getByText('Некорректное описание')).toBeInTheDocument();
    expect(screen.getByText('Проблемы с фото')).toBeInTheDocument();
    expect(screen.getByText('Подозрение на мошенничество')).toBeInTheDocument();
    expect(screen.getByText('Другое')).toBeInTheDocument();
  });

  it('должен отображать поле для комментария', () => {
    render(<BulkRejectModal {...mockProps} />);
    expect(screen.getByPlaceholderText('Дополнительный комментарий...')).toBeInTheDocument();
  });

  it('должен отображать кнопку "Отклонить"', () => {
    render(<BulkRejectModal {...mockProps} />);
    expect(screen.getByRole('button', { name: 'Отклонить' })).toBeInTheDocument();
  });

  it('должен отображать кнопку "Отмена"', () => {
    render(<BulkRejectModal {...mockProps} />);
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
  });

  it('должен вызывать onCancel при клике на "Отмена"', async () => {
    const user = userEvent.setup();
    render(<BulkRejectModal {...mockProps} />);

    const cancelBtn = screen.getByRole('button', { name: 'Отмена' });
    await user.click(cancelBtn);

    expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать onCancel при клике на overlay', async () => {
    const user = userEvent.setup();
    const { container } = render(<BulkRejectModal {...mockProps} />);

    const overlay = container.firstChild as HTMLElement;
    await user.click(overlay);

    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it('не должен вызывать onCancel при клике внутри модального окна', async () => {
    const user = userEvent.setup();
    render(<BulkRejectModal {...mockProps} />);

    const modalContent = screen.getByText('Отклонение объявлений').closest('div')!;
    await user.click(modalContent);

    expect(mockProps.onCancel).not.toHaveBeenCalled();
  });

  it('должен вызывать onReasonChange при выборе причины', async () => {
    const user = userEvent.setup();
    render(<BulkRejectModal {...mockProps} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'Запрещенный товар');

    expect(mockProps.onReasonChange).toHaveBeenCalled();
  });

  it('должен вызывать onCommentChange при вводе комментария', async () => {
    const user = userEvent.setup();
    render(<BulkRejectModal {...mockProps} />);

    const textarea = screen.getByPlaceholderText('Дополнительный комментарий...');
    await user.type(textarea, 'Тестовый комментарий');

    expect(mockProps.onCommentChange).toHaveBeenCalled();
  });

  it('должен вызывать onConfirm при клике на "Отклонить"', async () => {
    const user = userEvent.setup();
    render(<BulkRejectModal {...mockProps} reason="Запрещенный товар" />);

    const confirmBtn = screen.getByRole('button', { name: 'Отклонить' });
    await user.click(confirmBtn);

    expect(mockProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('должен блокировать кнопку "Отклонить" если причина не выбрана', () => {
    render(<BulkRejectModal {...mockProps} reason="" />);

    const confirmBtn = screen.getByRole('button', { name: 'Отклонить' });
    expect(confirmBtn).toBeDisabled();
  });

  it('не должен блокировать кнопку "Отклонить" если причина выбрана', () => {
    render(<BulkRejectModal {...mockProps} reason="Запрещенный товар" />);

    const confirmBtn = screen.getByRole('button', { name: 'Отклонить' });
    expect(confirmBtn).not.toBeDisabled();
  });

  it('должен блокировать кнопки во время обработки', () => {
    render(<BulkRejectModal {...mockProps} isProcessing={true} reason="Запрещенный товар" />);

    const confirmBtn = screen.getByRole('button', { name: 'Обработка...' });
    const cancelBtn = screen.getByRole('button', { name: 'Отмена' });

    expect(confirmBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();
  });

  it('должен отображать "Обработка..." во время обработки', () => {
    render(<BulkRejectModal {...mockProps} isProcessing={true} reason="Запрещенный товар" />);

    expect(screen.getByText('Обработка...')).toBeInTheDocument();
  });

  it('должен отображать выбранную причину в селекте', () => {
    render(<BulkRejectModal {...mockProps} reason="Запрещенный товар" />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('Запрещенный товар');
  });

  it('должен отображать введенный комментарий', () => {
    render(<BulkRejectModal {...mockProps} comment="Тестовый комментарий" />);

    const textarea = screen.getByPlaceholderText('Дополнительный комментарий...') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Тестовый комментарий');
  });

  it('должен правильно отображать разное количество объявлений', () => {
    const { rerender } = render(<BulkRejectModal {...mockProps} selectedCount={1} />);
    expect(screen.getByText(/1 объявлений/)).toBeInTheDocument();

    rerender(<BulkRejectModal {...mockProps} selectedCount={10} />);
    expect(screen.getByText(/10 объявлений/)).toBeInTheDocument();

    rerender(<BulkRejectModal {...mockProps} selectedCount={100} />);
    expect(screen.getByText(/100 объявлений/)).toBeInTheDocument();
  });

  it('не должен вызывать callbacks если кнопки заблокированы', async () => {
    const user = userEvent.setup();
    const mockOnConfirm = vi.fn();

    render(
      <BulkRejectModal
        {...mockProps}
        reason=""
        onConfirm={mockOnConfirm}
      />
    );

    const confirmBtn = screen.getByRole('button', { name: 'Отклонить' });
    await user.click(confirmBtn);

    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('должен иметь маркировку обязательного поля для причины', () => {
    render(<BulkRejectModal {...mockProps} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});

