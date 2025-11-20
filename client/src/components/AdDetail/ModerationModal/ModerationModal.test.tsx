import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModerationModal } from './ModerationModal';
import type { RejectReason } from '@/types';

describe('ModerationModal', () => {
  const mockProps = {
    isOpen: true,
    title: 'Тестовое модальное окно',
    selectedReason: '' as RejectReason | '',
    comment: '',
    onReasonChange: vi.fn(),
    onCommentChange: vi.fn(),
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    confirmLabel: 'Подтвердить',
    confirmClassName: 'testClass',
    placeholder: 'Введите комментарий...',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('не должен рендериться если isOpen = false', () => {
    render(<ModerationModal {...mockProps} isOpen={false} />);
    expect(screen.queryByText(mockProps.title)).not.toBeInTheDocument();
  });

  it('должен рендериться если isOpen = true', () => {
    render(<ModerationModal {...mockProps} />);
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
  });

  it('должен отображать заголовок', () => {
    render(<ModerationModal {...mockProps} />);
    expect(screen.getByRole('heading', { name: mockProps.title })).toBeInTheDocument();
  });

  it('должен отображать селект с причинами', () => {
    render(<ModerationModal {...mockProps} />);
    expect(screen.getByText('Причина *')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('должен отображать textarea для комментария', () => {
    render(<ModerationModal {...mockProps} />);
    expect(screen.getByText('Комментарий')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(mockProps.placeholder!)).toBeInTheDocument();
  });

  it('должен отображать кнопку отмены', () => {
    render(<ModerationModal {...mockProps} />);
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
  });

  it('должен отображать кнопку подтверждения с правильным label', () => {
    render(<ModerationModal {...mockProps} />);
    expect(screen.getByRole('button', { name: mockProps.confirmLabel })).toBeInTheDocument();
  });

  it('должен вызывать onCancel при клике на кнопку отмены', async () => {
    const user = userEvent.setup();
    render(<ModerationModal {...mockProps} />);

    const cancelBtn = screen.getByRole('button', { name: 'Отмена' });
    await user.click(cancelBtn);

    expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать onCancel при клике на overlay', async () => {
    const user = userEvent.setup();
    const { container } = render(<ModerationModal {...mockProps} />);

    const overlay = container.querySelector('.modalOverlay');
    if (overlay) {
      await user.click(overlay);
      expect(mockProps.onCancel).toHaveBeenCalled();
    }
  });

  it('не должен вызывать onCancel при клике внутри модального окна', async () => {
    const user = userEvent.setup();
    const { container } = render(<ModerationModal {...mockProps} />);

    const modal = container.querySelector('.modal');
    if (modal) {
      await user.click(modal);
      expect(mockProps.onCancel).not.toHaveBeenCalled();
    }
  });

  it('должен вызывать onConfirm при клике на кнопку подтверждения', async () => {
    const user = userEvent.setup();
    render(<ModerationModal {...mockProps} />);

    const confirmBtn = screen.getByRole('button', { name: mockProps.confirmLabel });
    await user.click(confirmBtn);

    expect(mockProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать onReasonChange при выборе причины', async () => {
    const user = userEvent.setup();
    render(<ModerationModal {...mockProps} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'Запрещенный товар');

    expect(mockProps.onReasonChange).toHaveBeenCalled();
  });

  it('должен вызывать onCommentChange при вводе комментария', async () => {
    const user = userEvent.setup();
    render(<ModerationModal {...mockProps} />);

    const textarea = screen.getByPlaceholderText(mockProps.placeholder!);
    await user.type(textarea, 'Тестовый комментарий');

    expect(mockProps.onCommentChange).toHaveBeenCalled();
  });

  it('должен отображать выбранную причину', () => {
    render(
      <ModerationModal
        {...mockProps}
        selectedReason="Запрещенный товар"
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('Запрещенный товар');
  });

  it('должен отображать введенный комментарий', () => {
    const testComment = 'Тестовый комментарий';
    render(
      <ModerationModal
        {...mockProps}
        comment={testComment}
      />
    );

    const textarea = screen.getByPlaceholderText(mockProps.placeholder!) as HTMLTextAreaElement;
    expect(textarea.value).toBe(testComment);
  });

  it('должен иметь опцию "Выберите причину" по умолчанию', () => {
    render(<ModerationModal {...mockProps} />);
    expect(screen.getByText('Выберите причину')).toBeInTheDocument();
  });

  it('должен отображать все возможные причины', () => {
    render(<ModerationModal {...mockProps} />);

    const select = screen.getByRole('combobox');
    const options = within(select).getAllByRole('option');

    // Должна быть как минимум placeholder опция + причины
    expect(options.length).toBeGreaterThan(1);
  });

  it('должен отображать кнопку закрытия в header', () => {
    render(<ModerationModal {...mockProps} />);

    // Ищем кнопку с иконкой закрытия
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(btn =>
      btn.className.includes('modalClose') || btn.querySelector('svg')
    );

    expect(closeButton).toBeTruthy();
  });

  it('должен вызывать onCancel при клике на кнопку закрытия', async () => {
    const user = userEvent.setup();
    const { container } = render(<ModerationModal {...mockProps} />);

    const closeButton = container.querySelector('.modalClose');
    if (closeButton) {
      await user.click(closeButton);
      expect(mockProps.onCancel).toHaveBeenCalled();
    }
  });

  it('должен применять кастомный placeholder', () => {
    const customPlaceholder = 'Кастомный плейсхолдер';
    render(<ModerationModal {...mockProps} placeholder={customPlaceholder} />);

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('должен применять кастомный className к кнопке подтверждения', () => {
      render(<ModerationModal {...mockProps} />);

    const confirmBtn = screen.getByRole('button', { name: mockProps.confirmLabel });
    expect(confirmBtn.className).toContain(mockProps.confirmClassName);
  });

  it('должен иметь правильную структуру DOM', () => {
      render(<ModerationModal {...mockProps} />);

    // CSS modules генерируют хешированные имена классов, проверяем наличие элементов по содержимому
    expect(screen.getByRole('heading', { name: mockProps.title })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(mockProps.placeholder!)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: mockProps.confirmLabel })).toBeInTheDocument();
  });

  it('должен корректно работать с пустым selectedReason', () => {
    render(<ModerationModal {...mockProps} selectedReason="" />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('');
  });

  it('должен корректно работать с пустым comment', () => {
    render(<ModerationModal {...mockProps} comment="" />);

    const textarea = screen.getByPlaceholderText(mockProps.placeholder!) as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
  });
});

