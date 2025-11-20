import { MdCheckCircle, MdCancel, MdWarning } from 'react-icons/md';
import { formatDateTime } from '../../../utils';
import styles from './ModerationHistory.module.css';

interface HistoryItem {
  id: number;
  moderatorName: string;
  action: string;
  timestamp: string;
  reason?: string | null;
  comment?: string;
}

interface ModerationHistoryProps {
  history: HistoryItem[];
}

export const ModerationHistory = ({ history }: ModerationHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className={styles.history}>
        <h3>История модерации</h3>
        <p className={styles.noHistory}>Действий пока не было</p>
      </div>
    );
  }

  return (
    <div className={styles.history}>
      <h3>История модерации</h3>
      <div className={styles.timeline}>
        {history.map((item) => (
          <div key={item.id} className={styles.historyItem}>
            <div className={styles.historyIcon}>
              {item.action === 'approved' && <MdCheckCircle style={{ color: '#4CAF50' }} />}
              {item.action === 'rejected' && <MdCancel style={{ color: '#F44336' }} />}
              {item.action === 'requestChanges' && <MdWarning style={{ color: '#FF9800' }} />}
            </div>
            <div className={styles.historyContent}>
              <div className={styles.historyHeader}>
                <strong>{item.moderatorName}</strong>
                <span className={styles.historyTime}>{formatDateTime(item.timestamp)}</span>
              </div>
              <div className={styles.historyAction}>
                {item.action === 'approved' && 'Одобрил объявление'}
                {item.action === 'rejected' && 'Отклонил объявление'}
                {item.action === 'requestChanges' && 'Запросил изменения'}
              </div>
              {item.reason && (
                <div className={styles.historyReason}>Причина: {item.reason}</div>
              )}
              {item.comment && (
                <div className={styles.historyComment}>{item.comment}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

