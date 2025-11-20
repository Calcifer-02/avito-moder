import { MdClose } from 'react-icons/md';
import type { RejectReason } from '@/types';
import { REJECTION_REASONS } from '../../../utils/constants';
import styles from './ModerationModal.module.css';

interface ModerationModalProps {
  isOpen: boolean;
  title: string;
  selectedReason: RejectReason | '';
  comment: string;
  onReasonChange: (reason: RejectReason | '') => void;
  onCommentChange: (comment: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel: string;
  confirmClassName: string;
  placeholder?: string;
}

export const ModerationModal = ({
  isOpen,
  title,
  selectedReason,
  comment,
  onReasonChange,
  onCommentChange,
  onConfirm,
  onCancel,
  confirmLabel,
  confirmClassName,
  placeholder = 'Дополнительные пояснения...',
}: ModerationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button onClick={onCancel} className={styles.modalClose}>
            <MdClose />
          </button>
        </div>
        <div className={styles.modalBody}>
          <label>Причина *</label>
          <select
            value={selectedReason}
            onChange={(e) => onReasonChange(e.target.value as RejectReason | '')}
            className={styles.modalSelect}
          >
            <option value="">Выберите причину</option>
            {REJECTION_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>

          <label>Комментарий</label>
          <textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder={placeholder}
            className={styles.modalTextarea}
            rows={4}
          />
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onCancel} className={`${styles.modalBtn} ${styles.modalBtnCancel}`}>
            Отмена
          </button>
          <button onClick={onConfirm} className={`${styles.modalBtn} ${confirmClassName}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

