import type { RejectReason } from '../../../types';
import { REJECTION_REASONS } from '../../../utils/constants';
import styles from './BulkRejectModal.module.css';

interface BulkRejectModalProps {
  isOpen: boolean;
  selectedCount: number;
  reason: RejectReason | '';
  comment: string;
  isProcessing: boolean;
  onReasonChange: (reason: RejectReason | '') => void;
  onCommentChange: (comment: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BulkRejectModal = ({
  isOpen,
  selectedCount,
  reason,
  comment,
  isProcessing,
  onReasonChange,
  onCommentChange,
  onConfirm,
  onCancel,
}: BulkRejectModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Отклонение объявлений</h2>
        <p className={styles.modalSubtitle}>
          Вы собираетесь отклонить {selectedCount} объявлений
        </p>

        <div className={styles.modalGroup}>
          <label className={styles.modalLabel}>
            Причина отклонения <span className={styles.required}>*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => onReasonChange(e.target.value as RejectReason | '')}
            className={styles.modalSelect}
          >
            <option value="">Выберите причину</option>
            {REJECTION_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.modalGroup}>
          <label className={styles.modalLabel}>Комментарий (необязательно)</label>
          <textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Дополнительный комментарий..."
            className={styles.modalTextarea}
            rows={4}
          />
        </div>

        <div className={styles.modalActions}>
          <button
            onClick={onConfirm}
            className={styles.modalConfirm}
            disabled={!reason || isProcessing}
          >
            {isProcessing ? 'Обработка...' : 'Отклонить'}
          </button>
          <button
            onClick={onCancel}
            className={styles.modalCancel}
            disabled={isProcessing}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

