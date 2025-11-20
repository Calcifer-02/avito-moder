import styles from './BulkActionsPanel.module.css';

interface BulkActionsPanelProps {
  selectedCount: number;
  isProcessing: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export const BulkActionsPanel = ({
  selectedCount,
  isProcessing,
  onSelectAll,
  onClearSelection,
  onApprove,
  onReject,
}: BulkActionsPanelProps) => {
  return (
    <div className={styles.bulkPanel}>
      <div className={styles.bulkInfo}>
        <span className={styles.bulkCount}>
          Выбрано: <strong>{selectedCount}</strong>
        </span>
        <button onClick={onSelectAll} className={styles.bulkSelectAll}>
          Выбрать все на странице
        </button>
        <button onClick={onClearSelection} className={styles.bulkClear}>
          Снять выделение
        </button>
      </div>
      <div className={styles.bulkActions}>
        <button
          onClick={onApprove}
          className={styles.bulkApprove}
          disabled={isProcessing}
        >
          {isProcessing ? 'Обработка...' : 'Одобрить выбранные'}
        </button>
        <button
          onClick={onReject}
          className={styles.bulkReject}
          disabled={isProcessing}
        >
          {isProcessing ? 'Обработка...' : 'Отклонить выбранные'}
        </button>
      </div>
    </div>
  );
};

