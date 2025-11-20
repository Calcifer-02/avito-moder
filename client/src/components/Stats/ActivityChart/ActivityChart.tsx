import type { ActivityData } from '../../../types';
import styles from './ActivityChart.module.css';

interface ActivityChartProps {
  data: ActivityData[];
}

export const ActivityChart = ({ data }: ActivityChartProps) => {
  if (!data || data.length === 0) return null;

  const maxTotal = Math.max(...data.map((d) => d.approved + d.rejected + d.requestChanges));

  return (
    <div className={styles.chartCard}>
      <h3>График активности по дням</h3>
      <div className={styles.barChartWrapper}>
        <div className={styles.barChart}>
          {data.map((day) => {
            const total = day.approved + day.rejected + day.requestChanges;
            const heightPercent = total > 0 ? (total / maxTotal) * 100 : 0;

            return (
              <div key={day.date} className={styles.barGroup}>
                <div className={styles.barStack} style={{ height: `${heightPercent}%` }}>
                  <div
                    className={`${styles.barSegment} ${styles.barApproved}`}
                    style={{ height: `${(day.approved / total) * 100}%` }}
                    title={`Одобрено: ${day.approved}`}
                  />
                  <div
                    className={`${styles.barSegment} ${styles.barRejected}`}
                    style={{ height: `${(day.rejected / total) * 100}%` }}
                    title={`Отклонено: ${day.rejected}`}
                  />
                  <div
                    className={`${styles.barSegment} ${styles.barChanges}`}
                    style={{ height: `${(day.requestChanges / total) * 100}%` }}
                    title={`На доработку: ${day.requestChanges}`}
                  />
                </div>
                <div className={styles.barLabel}>
                  {new Date(day.date).toLocaleDateString('ru', { day: '2-digit', month: 'short' })}
                </div>
                <div className={styles.barTotal}>{total}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.chartLegend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ background: '#4CAF50' }}></div>
          <span>Одобрено</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ background: '#F44336' }}></div>
          <span>Отклонено</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ background: '#FF9800' }}></div>
          <span>На доработку</span>
        </div>
      </div>
    </div>
  );
};

