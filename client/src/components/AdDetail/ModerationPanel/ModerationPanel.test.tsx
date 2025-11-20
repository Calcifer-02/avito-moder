import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModerationPanel } from './ModerationPanel';
import type { AdStatus } from '@/types';

describe('ModerationPanel', () => {
  const mockProps = {
    status: 'pending' as AdStatus,
    isApproving: false,
    isRejecting: false,
    isRequestingChanges: false,
    onApprove: vi.fn(),
    onReject: vi.fn(),
    onRequestChanges: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен рендерить заголовок', () => {
    render(<ModerationPanel {...mockProps} />);
    expect(screen.getByText('Действия модератора')).toBeInTheDocument();
  });

  it('должен отображать все три кнопки действий', () => {
    render(<ModerationPanel {...mockProps} />);

    expect(screen.getByRole('button', { name: /Одобрить/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Отклонить/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Вернуть на доработку/ })).toBeInTheDocument();
  });

  it('должен вызывать onApprove при клике на кнопку одобрения', async () => {
    const user = userEvent.setup();
    render(<ModerationPanel {...mockProps} />);

    const approveBtn = screen.getByRole('button', { name: /Одобрить/ });
    await user.click(approveBtn);

    expect(mockProps.onApprove).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать onReject при клике на кнопку отклонения', async () => {
    const user = userEvent.setup();
    render(<ModerationPanel {...mockProps} />);

    const rejectBtn = screen.getByRole('button', { name: /Отклонить/ });
    await user.click(rejectBtn);

    expect(mockProps.onReject).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать onRequestChanges при клике на кнопку возврата', async () => {
    const user = userEvent.setup();
    render(<ModerationPanel {...mockProps} />);

    const requestBtn = screen.getByRole('button', { name: /Вернуть на доработку/ });
    await user.click(requestBtn);

    expect(mockProps.onRequestChanges).toHaveBeenCalledTimes(1);
  });

  it('должен блокировать кнопку одобрения если статус "approved"', () => {
    render(<ModerationPanel {...mockProps} status="approved" />);

    const approveBtn = screen.getByRole('button', { name: /Одобрить/ });
    expect(approveBtn).toBeDisabled();
  });

  it('должен блокировать кнопку отклонения если статус "rejected"', () => {
    render(<ModerationPanel {...mockProps} status="rejected" />);

    const rejectBtn = screen.getByRole('button', { name: /Отклонить/ });
    expect(rejectBtn).toBeDisabled();
  });

  it('должен блокировать кнопку одобрения во время загрузки', () => {
    render(<ModerationPanel {...mockProps} isApproving={true} />);

    const approveBtn = screen.getByRole('button', { name: /Одобрить/ });
    expect(approveBtn).toBeDisabled();
  });

  it('должен блокировать кнопку отклонения во время загрузки', () => {
    render(<ModerationPanel {...mockProps} isRejecting={true} />);

    const rejectBtn = screen.getByRole('button', { name: /Отклонить/ });
    expect(rejectBtn).toBeDisabled();
  });

  it('должен блокировать кнопку возврата во время загрузки', () => {
    render(<ModerationPanel {...mockProps} isRequestingChanges={true} />);

    const requestBtn = screen.getByRole('button', { name: /Вернуть на доработку/ });
    expect(requestBtn).toBeDisabled();
  });

  it('должен отображать подсказки с горячими клавишами', () => {
    render(<ModerationPanel {...mockProps} />);

    expect(screen.getByText('Горячие клавиши:')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('- Одобрить')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('- Отклонить')).toBeInTheDocument();
    expect(screen.getByText('- Навигация')).toBeInTheDocument();
  });

  it('не должен блокировать кнопки для статуса "pending"', () => {
    render(<ModerationPanel {...mockProps} status="pending" />);

    const approveBtn = screen.getByRole('button', { name: /Одобрить/ });
    const rejectBtn = screen.getByRole('button', { name: /Отклонить/ });
    const requestBtn = screen.getByRole('button', { name: /Вернуть на доработку/ });

    expect(approveBtn).not.toBeDisabled();
    expect(rejectBtn).not.toBeDisabled();
    expect(requestBtn).not.toBeDisabled();
  });

  it('не должен блокировать кнопки для статуса "draft"', () => {
    render(<ModerationPanel {...mockProps} status="draft" />);

    const approveBtn = screen.getByRole('button', { name: /Одобрить/ });
    const rejectBtn = screen.getByRole('button', { name: /Отклонить/ });

    expect(approveBtn).not.toBeDisabled();
    expect(rejectBtn).not.toBeDisabled();
  });

  it('должен отображать иконки в кнопках', () => {
    const { container } = render(<ModerationPanel {...mockProps} />);

    // Проверяем что есть SVG иконки
    const icons = container.querySelectorAll('button svg');
    expect(icons.length).toBe(3); // По одной иконке в каждой кнопке
  });

  it('должен корректно обрабатывать множественные клики', async () => {
    const user = userEvent.setup();
    render(<ModerationPanel {...mockProps} />);

    const approveBtn = screen.getByRole('button', { name: /Одобрить/ });

    await user.click(approveBtn);
    await user.click(approveBtn);
    await user.click(approveBtn);

    expect(mockProps.onApprove).toHaveBeenCalledTimes(3);
  });

  it('не должен вызывать callbacks если кнопки заблокированы', async () => {
    const user = userEvent.setup();
    render(<ModerationPanel {...mockProps} status="approved" />);

    const approveBtn = screen.getByRole('button', { name: /Одобрить/ });
    await user.click(approveBtn);

    expect(mockProps.onApprove).not.toHaveBeenCalled();
  });
});

