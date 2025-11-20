import { MdCheckCircle, MdCancel, MdWarning } from 'react-icons/md';
import type { AdStatus } from '@/types';
import styles from './ModerationPanel.module.css';

interface ModerationPanelProps {
  status: AdStatus;
  isApproving: boolean;
  isRejecting: boolean;
  isRequestingChanges: boolean;
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: () => void;
}

export const ModerationPanel = ({
  status,
  isApproving,
  isRejecting,
  isRequestingChanges,
  onApprove,
  onReject,
  onRequestChanges,
}: ModerationPanelProps) => {
  return (
    <div className={styles.moderationPanel}>
      <h3>Действия модератора</h3>
      <div className={styles.moderationActions}>
        <button
          onClick={onApprove}
          disabled={status === 'approved' || isApproving}
          className={`${styles.modBtn} ${styles.modBtnApprove}`}
        >
          <MdCheckCircle /> Одобрить
        </button>
        <button
          onClick={onReject}
          disabled={status === 'rejected' || isRejecting}
          className={`${styles.modBtn} ${styles.modBtnReject}`}
        >
          <MdCancel /> Отклонить
        </button>
        <button
          onClick={onRequestChanges}
          disabled={isRequestingChanges}
          className={`${styles.modBtn} ${styles.modBtnRequest}`}
        >
          <MdWarning /> Вернуть на доработку
        </button>
      </div>
      <div className={styles.hint}>
        <strong>Горячие клавиши:</strong>
        <ul>
          <li><kbd>A</kbd> - Одобрить</li>
          <li><kbd>D</kbd> - Отклонить</li>
          <li><kbd>←</kbd> <kbd>→</kbd> - Навигация</li>
        </ul>
      </div>
    </div>
  );
};

