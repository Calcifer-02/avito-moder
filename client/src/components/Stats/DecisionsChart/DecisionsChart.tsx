import type { DecisionsData } from '../../../types';
import styles from './DecisionsChart.module.css';

interface DecisionsChartProps {
  data: DecisionsData;
}

export const DecisionsChart = ({ data }: DecisionsChartProps) => {
  if (!data) return null;

  let currentAngle = 0;

  const createArc = (percentage: number, color: string) => {
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 100 + 80 * Math.cos(startRad);
    const y1 = 100 + 80 * Math.sin(startRad);
    const x2 = 100 + 80 * Math.cos(endRad);
    const y2 = 100 + 80 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return (
      <path
        key={color}
        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={color}
      />
    );
  };

  return (
    <div className={styles.chartCard}>
      <h3>Распределение решений</h3>
      <div className={styles.pieChart}>
        <svg viewBox="0 0 200 200" className={styles.pieSvg}>
          {data.approved > 0 && createArc(data.approved, '#4CAF50')}
          {data.rejected > 0 && createArc(data.rejected, '#F44336')}
          {data.requestChanges > 0 && createArc(data.requestChanges, '#FF9800')}
        </svg>
        <div className={styles.pieStats}>
          <div className={styles.pieStat}>
            <div className={styles.pieStatColor} style={{ background: '#4CAF50' }}></div>
            <div className={styles.pieStatContent}>
              <div className={styles.pieStatLabel}>Одобрено</div>
              <div className={styles.pieStatValue}>{data.approved.toFixed(1)}%</div>
            </div>
          </div>
          <div className={styles.pieStat}>
            <div className={styles.pieStatColor} style={{ background: '#F44336' }}></div>
            <div className={styles.pieStatContent}>
              <div className={styles.pieStatLabel}>Отклонено</div>
              <div className={styles.pieStatValue}>{data.rejected.toFixed(1)}%</div>
            </div>
          </div>
          <div className={styles.pieStat}>
            <div className={styles.pieStatColor} style={{ background: '#FF9800' }}></div>
            <div className={styles.pieStatContent}>
              <div className={styles.pieStatLabel}>На доработку</div>
              <div className={styles.pieStatValue}>{data.requestChanges.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

