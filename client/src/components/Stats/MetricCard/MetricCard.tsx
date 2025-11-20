import type {ReactNode} from 'react';
import styles from './MetricCard.module.css';

interface MetricCardProps {
  icon: ReactNode;
  iconColor: string;
  label: string;
  value: string | number;
  meta?: string | number;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
}

export const MetricCard = ({
  icon,
  iconColor,
  label,
  value,
  meta,
  variant = 'primary',
}: MetricCardProps) => {
  return (
    <div className={`${styles.card} ${styles[`card${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}`}>
      <div className={styles.cardIcon} style={{ color: iconColor }}>
        {icon}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardLabel}>{label}</div>
        <div className={styles.cardValue}>{value}</div>
        {meta && <div className={styles.cardMeta}>{meta}</div>}
      </div>
    </div>
  );
};

