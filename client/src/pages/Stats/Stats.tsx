import { useState } from 'react';
import {
  MdAssessment,
  MdCheckCircle,
  MdCancel,
  MdWarning,
  MdAccessTime,
  MdCalendarToday,
  MdFileDownload,
  MdPictureAsPdf
} from 'react-icons/md';
import {
  useStatsSummary,
  useActivityChart,
  useDecisionsChart,
  useCategoriesChart,
} from '@hooks/useStats';
import type { StatsPeriod, ActivityData } from '@/types';
import { STATS_PERIODS } from '@utils/constants.ts';
import { exportToCSV, exportToPDF } from '@utils/export';
import styles from './Stats.module.css';

export const Stats = () => {
  const [period, setPeriod] = useState<StatsPeriod>('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Формируем фильтры
  const filters = period === 'custom' && startDate && endDate
    ? { period, startDate, endDate }
    : { period };

  // Загружаем данные
  const { data: summary, isLoading: summaryLoading } = useStatsSummary(filters);
  const { data: activityData } = useActivityChart(filters);
  const { data: decisionsData } = useDecisionsChart(filters);
  const { data: categoriesData } = useCategoriesChart(filters);

  const handlePeriodChange = (newPeriod: StatsPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  };

  // Обработчики экспорта
  const handleExportCSV = () => {
    exportToCSV(summary, activityData, categoriesData, period);
  };

  const handleExportPDF = () => {
    exportToPDF(summary, activityData, decisionsData, categoriesData, period);
  };

  // Функция для форматирования времени (секунды в минуты и секунды)
  const formatReviewTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}м ${secs}с`;
  };

  return (
    <div className={styles.page}>
      {/* Hero секция */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div>
            <h1 className={styles.heroTitle}>Статистика модератора</h1>
            <p className={styles.heroSubtitle}>Аналитика работы и эффективности модерации</p>
          </div>
          <img src='src/assets/Layer.svg' alt="Avito Tech Layer" className={styles.LayerImage}/>
        </div>
      </div>

      {/* Основной контент */}
      <div className={styles.container}>
        {/* Фильтр по периоду */}
        <div className={styles.filter}>
          <div className={styles.filterHeader}>
            <div className={styles.periodTabs}>
              <button
                className={`${styles.periodTab} ${period === STATS_PERIODS.TODAY ? styles.active : ''}`}
                onClick={() => handlePeriodChange(STATS_PERIODS.TODAY)}
              >
                <MdCalendarToday /> Сегодня
              </button>
              <button
                className={`${styles.periodTab} ${period === STATS_PERIODS.WEEK ? styles.active : ''}`}
                onClick={() => handlePeriodChange(STATS_PERIODS.WEEK)}
              >
                <MdCalendarToday /> Неделя
              </button>
              <button
                className={`${styles.periodTab} ${period === STATS_PERIODS.MONTH ? styles.active : ''}`}
                onClick={() => handlePeriodChange(STATS_PERIODS.MONTH)}
              >
                <MdCalendarToday /> Месяц
              </button>
              <button
                className={`${styles.periodTab} ${period === STATS_PERIODS.CUSTOM ? styles.active : ''}`}
                onClick={() => handlePeriodChange(STATS_PERIODS.CUSTOM)}
              >
                <MdCalendarToday /> Произвольный
              </button>
            </div>

            <div className={styles.exportButtons}>
              <button
                onClick={handleExportCSV}
                className={styles.exportBtn}
                disabled={!summary}
                title="Экспорт в CSV"
              >
                <MdFileDownload /> CSV
              </button>
              <button
                onClick={handleExportPDF}
                className={styles.exportBtnPdf}
                disabled={!summary}
                title="Экспорт в PDF"
              >
                <MdPictureAsPdf /> PDF
              </button>
            </div>
          </div>

          {period === 'custom' && (
            <div className={styles.customRange}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={styles.dateInput}
              />
              <span>—</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
          )}
        </div>

        {summaryLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Загрузка статистики...</p>
          </div>
        ) : (
          <>
            {/* Карточки метрик */}
            {summary && (
              <div className={styles.cards}>
                <div className={`${styles.card} ${styles.cardPrimary}`}>
                  <div className={styles.cardIcon}>
                    <MdAssessment style={{ color: '#0AF' }} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLabel}>Всего проверено</div>
                    <div className={styles.cardValue}>{summary.totalReviewed.toLocaleString()}</div>
                    <div className={styles.cardMeta}>
                      <span>Сегодня: {summary.totalReviewedToday}</span>
                    </div>
                  </div>
                </div>

                <div className={`${styles.card} ${styles.cardSuccess}`}>
                  <div className={styles.cardIcon}>
                    <MdCheckCircle style={{ color: '#4CAF50' }} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLabel}>Одобрено</div>
                    <div className={styles.cardValue}>{summary.approvedPercentage.toFixed(1)}%</div>
                    <div className={styles.cardMeta}>Процент одобренных объявлений</div>
                  </div>
                </div>

                <div className={`${styles.card} ${styles.cardDanger}`}>
                  <div className={styles.cardIcon}>
                    <MdCancel style={{ color: '#F44336' }} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLabel}>Отклонено</div>
                    <div className={styles.cardValue}>{summary.rejectedPercentage.toFixed(1)}%</div>
                    <div className={styles.cardMeta}>Процент отклоненных объявлений</div>
                  </div>
                </div>

                <div className={`${styles.card} ${styles.cardWarning}`}>
                  <div className={styles.cardIcon}>
                    <MdWarning style={{ color: '#FF9800' }} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLabel}>На доработку</div>
                    <div className={styles.cardValue}>{summary.requestChangesPercentage.toFixed(1)}%</div>
                    <div className={styles.cardMeta}>Процент возвращенных объявлений</div>
                  </div>
                </div>

                <div className={`${styles.card} ${styles.cardInfo}`}>
                  <div className={styles.cardIcon}>
                    <MdAccessTime style={{ color: '#2196F3' }} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLabel}>Среднее время проверки</div>
                    <div className={styles.cardValue}>{formatReviewTime(summary.averageReviewTime)}</div>
                    <div className={styles.cardMeta}>На одно объявление</div>
                  </div>
                </div>

              </div>
            )}

            {/* Графики */}
            <div className={styles.charts}>
              {/* График активности */}
              {activityData && activityData.length > 0 && (
                <div className={styles.chartCard}>
                  <h3>График активности по дням</h3>
                  <div className={styles.barChartWrapper}>
                    <div className={styles.barChart}>
                    {activityData.map((day: ActivityData) => {
                      const total = day.approved + day.rejected + day.requestChanges;
                      const maxTotal = Math.max(...activityData.map((d: ActivityData) => d.approved + d.rejected + d.requestChanges));
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
                          <div className={styles.barLabel}>{new Date(day.date).toLocaleDateString('ru', { day: '2-digit', month: 'short' })}</div>
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
              )}

              {/* Круговая диаграмма решений */}
              {decisionsData && (
                <div className={styles.chartCard}>
                  <h3>Распределение решений</h3>
                  <div className={styles.pieChart}>
                    <svg viewBox="0 0 200 200" className={styles.pieSvg}>
                      {(() => {
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
                          <>
                            {decisionsData.approved > 0 && createArc(decisionsData.approved, '#4CAF50')}
                            {decisionsData.rejected > 0 && createArc(decisionsData.rejected, '#F44336')}
                            {decisionsData.requestChanges > 0 && createArc(decisionsData.requestChanges, '#FF9800')}
                          </>
                        );
                      })()}
                    </svg>
                    <div className={styles.pieStats}>
                      <div className={styles.pieStat}>
                        <div className={styles.pieStatColor} style={{ background: '#4CAF50' }}></div>
                        <div className={styles.pieStatContent}>
                          <div className={styles.pieStatLabel}>Одобрено</div>
                          <div className={styles.pieStatValue}>{decisionsData.approved.toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className={styles.pieStat}>
                        <div className={styles.pieStatColor} style={{ background: '#F44336' }}></div>
                        <div className={styles.pieStatContent}>
                          <div className={styles.pieStatLabel}>Отклонено</div>
                          <div className={styles.pieStatValue}>{decisionsData.rejected.toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className={styles.pieStat}>
                        <div className={styles.pieStatColor} style={{ background: '#FF9800' }}></div>
                        <div className={styles.pieStatContent}>
                          <div className={styles.pieStatLabel}>На доработку</div>
                          <div className={styles.pieStatValue}>{decisionsData.requestChanges.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* График по категориям */}
              {categoriesData && Object.keys(categoriesData).length > 0 && (
                <div className={`${styles.chartCard} ${styles.chartCardFull}`}>
                  <h3>Проверено по категориям</h3>
                  <div className={styles.categoryChart}>
                    {Object.entries(categoriesData)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([category, count]) => {
                        const maxCount = Math.max(...Object.values(categoriesData) as number[]);
                        const widthPercent = ((count as number) / maxCount) * 100;

                        return (
                          <div key={category} className={styles.categoryBar}>
                            <div className={styles.categoryLabel}>{category}</div>
                            <div className={styles.categoryBarContainer}>
                              <div
                                className={styles.categoryBarFill}
                                style={{ width: `${widthPercent}%` }}
                              >
                                <span className={styles.categoryBarValue}>{String(count)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
