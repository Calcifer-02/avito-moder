import type { AdStatus, AdPriority } from '@/types';
import { formatPrice, formatDateTime, getStatusText, getStatusColor, getPriorityText } from '../../../utils';
import styles from './AdInfo.module.css';

interface AdInfoProps {
  title: string;
  price: number;
  status: AdStatus;
  category: string;
  priority: AdPriority;
  createdAt: string;
  updatedAt: string;
  description: string;
  characteristics: Record<string, string>;
}

export const AdInfo = ({
  title,
  price,
  status,
  category,
  priority,
  createdAt,
  updatedAt,
  description,
  characteristics,
}: AdInfoProps) => {
  return (
    <div className={styles.infoSection}>
      <div className={styles.header}>
        <div>
          <h1>{title}</h1>
          <p className={styles.price}>{formatPrice(price)}</p>
        </div>
        <div
          className={styles.statusBadge}
          style={{ backgroundColor: getStatusColor(status) }}
        >
          {getStatusText(status)}
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Категория:</span>
          <span className={styles.metaValue}>{category}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Приоритет:</span>
          <span className={styles.metaValue}>{getPriorityText(priority)}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Создано:</span>
          <span className={styles.metaValue}>{formatDateTime(createdAt)}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Обновлено:</span>
          <span className={styles.metaValue}>{formatDateTime(updatedAt)}</span>
        </div>
      </div>

      <div className={styles.description}>
        <h3>Описание</h3>
        <p>{description}</p>
      </div>

      <div className={styles.characteristics}>
        <h3>Характеристики</h3>
        <table>
          <tbody>
            {Object.entries(characteristics).map(([key, value]) => (
              <tr key={key}>
                <td className={styles.charKey}>{key}</td>
                <td className={styles.charValue}>{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

