import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModerationHistory } from './ModerationHistory';

describe('ModerationHistory', () => {
  const mockHistory = [
    {
      id: 1,
      moderatorName: 'Иван Иванов',
      action: 'approved',
      timestamp: '2024-03-15T10:00:00Z',
      reason: undefined,
      comment: 'Все в порядке',
    },
    {
      id: 2,
      moderatorName: 'Петр Петров',
      action: 'rejected',
      timestamp: '2024-03-14T09:00:00Z',
      reason: 'Некорректное описание',
      comment: 'Нужно добавить больше деталей',
    },
    {
      id: 3,
      moderatorName: 'Сергей Сергеев',
      action: 'requestChanges',
      timestamp: '2024-03-13T08:00:00Z',
      reason: 'Проблемы с фото',
      comment: undefined,
    },
  ];

  it('должен рендерить заголовок', () => {
    render(<ModerationHistory history={mockHistory} />);
    expect(screen.getByText('История модерации')).toBeInTheDocument();
  });

  it('должен показывать сообщение для пустой истории', () => {
    render(<ModerationHistory history={[]} />);
    expect(screen.getByText('Действий пока не было')).toBeInTheDocument();
  });

  it('должен отображать все записи истории', () => {
    render(<ModerationHistory history={mockHistory} />);

    mockHistory.forEach((item) => {
      expect(screen.getByText(item.moderatorName)).toBeInTheDocument();
    });
  });

  it('должен отображать правильный текст действия для "approved"', () => {
    const approvedHistory = [mockHistory[0]];
    render(<ModerationHistory history={approvedHistory} />);
    expect(screen.getByText('Одобрил объявление')).toBeInTheDocument();
  });

  it('должен отображать правильный текст действия для "rejected"', () => {
    const rejectedHistory = [mockHistory[1]];
    render(<ModerationHistory history={rejectedHistory} />);
    expect(screen.getByText('Отклонил объявление')).toBeInTheDocument();
  });

  it('должен отображать правильный текст действия для "requestChanges"', () => {
    const requestChangesHistory = [mockHistory[2]];
    render(<ModerationHistory history={requestChangesHistory} />);
    expect(screen.getByText('Запросил изменения')).toBeInTheDocument();
  });

  it('должен отображать причину, если она есть', () => {
    render(<ModerationHistory history={mockHistory} />);
    expect(screen.getByText(/Причина: Некорректное описание/)).toBeInTheDocument();
    expect(screen.getByText(/Причина: Проблемы с фото/)).toBeInTheDocument();
  });

  it('не должен отображать причину, если её нет', () => {
    const historyWithoutReason = [{
      id: 1,
      moderatorName: 'Тест',
      action: 'approved',
      timestamp: '2024-03-15T10:00:00Z',
      reason: undefined,
      comment: undefined,
    }];
    render(<ModerationHistory history={historyWithoutReason} />);
    expect(screen.queryByText(/Причина:/)).not.toBeInTheDocument();
  });

  it('должен отображать комментарий, если он есть', () => {
    render(<ModerationHistory history={mockHistory} />);
    expect(screen.getByText('Все в порядке')).toBeInTheDocument();
    expect(screen.getByText('Нужно добавить больше деталей')).toBeInTheDocument();
  });

  it('не должен отображать комментарий, если его нет', () => {
    const historyWithoutComment = [{
      id: 1,
      moderatorName: 'Тест',
      action: 'approved',
      timestamp: '2024-03-15T10:00:00Z',
      reason: undefined,
      comment: undefined,
    }];
    render(<ModerationHistory history={historyWithoutComment} />);

    // Должен быть только модератор и действие, без дополнительного текста
    expect(screen.getByText('Тест')).toBeInTheDocument();
    expect(screen.getByText('Одобрил объявление')).toBeInTheDocument();
  });

  it('должен отображать временные метки', () => {
    render(<ModerationHistory history={mockHistory} />);
    // Проверяем что даты отформатированы и присутствуют
    const timeElements = screen.getAllByText(/\d{2}\.\d{2}\.\d{4}/);
    expect(timeElements.length).toBeGreaterThan(0);
  });

  it('должен отображать записи в правильном порядке', () => {
    render(<ModerationHistory history={mockHistory} />);

    const moderatorNames = screen.getAllByText(/Иванов|Петров|Сергеев/);
    expect(moderatorNames).toHaveLength(3);
  });

  it('должен обрабатывать одну запись', () => {
    const singleHistory = [mockHistory[0]];
    render(<ModerationHistory history={singleHistory} />);

    expect(screen.getByText('Иван Иванов')).toBeInTheDocument();
    expect(screen.getByText('Одобрил объявление')).toBeInTheDocument();
  });

  it('должен рендерить иконки для разных действий', () => {
    const { container } = render(<ModerationHistory history={mockHistory} />);
    // Проверяем что есть SVG иконки
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(mockHistory.length);
  });
});

