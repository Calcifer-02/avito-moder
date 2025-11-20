import { MdFolder, MdCalendarToday, MdLocalFireDepartment } from 'react-icons/md';
import type { Advertisement } from '../../../types';
import { formatPrice, formatDate, getStatusText, getStatusColor } from '../../../utils';
import styles from './AdCard.module.css';

interface AdCardProps {
  ad: Advertisement;
  isSelected?: boolean;
  isBulkMode?: boolean;
  onCardClick: (id: number) => void;
  onCheckboxChange?: (id: number, e: React.MouseEvent) => void;
}

export const AdCard = ({
  ad,
  isSelected = false,
  isBulkMode = false,
  onCardClick,
  onCheckboxChange,
}: AdCardProps) => {
  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${
        isBulkMode ? styles.bulkModeCard : ''
      }`}
      onClick={() => onCardClick(ad.id)}
    >
      {isBulkMode && onCheckboxChange && (
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onCheckboxChange(ad.id, e as any)}
            onClick={(e) => e.stopPropagation()}
            className={styles.cardCheckbox}
          />
        </div>
      )}

      <div className={styles.cardImage}>
        <img src={ad.images[0]} alt={ad.title} />
        {ad.priority === 'urgent' && (
          <div className={styles.priorityBadge}>
            <MdLocalFireDepartment /> Срочно
          </div>
        )}
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{ad.title}</h3>
        <p className={styles.cardPrice}>{formatPrice(ad.price)}</p>
        <div className={styles.cardMeta}>
          <span className={styles.metaItem}>
            <MdFolder className={styles.metaIcon} /> {ad.category}
          </span>
          <span className={styles.metaItem}>
            <MdCalendarToday className={styles.metaIcon} /> {formatDate(ad.createdAt)}
          </span>
        </div>
        <div
          className={styles.statusBadge}
          style={{ backgroundColor: getStatusColor(ad.status) }}
        >
          {getStatusText(ad.status)}
        </div>
      </div>
    </div>
  );
};

