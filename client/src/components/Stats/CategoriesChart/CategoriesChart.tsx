import styles from './CategoriesChart.module.css';

interface CategoriesChartProps {
  data: Record<string, number>;
}

export const CategoriesChart = ({ data }: CategoriesChartProps) => {
  if (!data || Object.keys(data).length === 0) return null;

  const maxCount = Math.max(...Object.values(data));

  return (
    <div className={`${styles.chartCard} ${styles.chartCardFull}`}>
      <h3>Проверено по категориям</h3>
      <div className={styles.categoryChart}>
        {Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .map(([category, count]) => {
            const widthPercent = (count / maxCount) * 100;

            return (
              <div key={category} className={styles.categoryBar}>
                <div className={styles.categoryLabel}>{category}</div>
                <div className={styles.categoryBarContainer}>
                  <div
                    className={styles.categoryBarFill}
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span className={styles.categoryBarValue}>{count}</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

