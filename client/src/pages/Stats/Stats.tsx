import { useState } from 'react';
import {
  MdAssessment,
  MdCheckCircle,
  MdCancel,
  MdWarning,
  MdAccessTime,
} from 'react-icons/md';
import {
  useStatsSummary,
  useActivityChart,
  useDecisionsChart,
  useCategoriesChart,
} from '@hooks/useStats';
import type { StatsPeriod } from '@/types';
import { exportToCSV, exportToPDF } from '@utils/export';
import { HeroSection } from '@components/AdsList';
import {
  PeriodFilter,
  MetricCard,
  ActivityChart,
  DecisionsChart,
  CategoriesChart,
} from '@components/Stats';
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
      <HeroSection
        title="Статистика модератора"
        subtitle="Аналитика работы и эффективности модерации"
        imageSrc="/Layer.svg"
      />

      {/* Основной контент */}
      <div className={styles.container}>
        <PeriodFilter
          period={period}
          startDate={startDate}
          endDate={endDate}
          onPeriodChange={handlePeriodChange}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          canExport={!!summary}
        />

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
                <MetricCard
                  icon={<MdAssessment />}
                  iconColor="#0AF"
                  label="Всего проверено"
                  value={summary.totalReviewed.toLocaleString()}
                  meta={`Сегодня: ${summary.totalReviewedToday}`}
                  variant="primary"
                />
                <MetricCard
                  icon={<MdCheckCircle />}
                  iconColor="#4CAF50"
                  label="Одобрено"
                  value={`${summary.approvedPercentage.toFixed(1)}%`}
                  meta="Процент одобренных объявлений"
                  variant="success"
                />
                <MetricCard
                  icon={<MdCancel />}
                  iconColor="#F44336"
                  label="Отклонено"
                  value={`${summary.rejectedPercentage.toFixed(1)}%`}
                  meta="Процент отклоненных объявлений"
                  variant="danger"
                />
                <MetricCard
                  icon={<MdWarning />}
                  iconColor="#FF9800"
                  label="На доработку"
                  value={`${summary.requestChangesPercentage.toFixed(1)}%`}
                  meta="Процент возвращенных объявлений"
                  variant="warning"
                />
                <MetricCard
                  icon={<MdAccessTime />}
                  iconColor="#2196F3"
                  label="Среднее время проверки"
                  value={formatReviewTime(summary.averageReviewTime)}
                  meta="На одно объявление"
                  variant="info"
                />
              </div>
            )}

            {/* Графики */}
            <div className={styles.charts}>
              {activityData && <ActivityChart data={activityData} />}
              {decisionsData && <DecisionsChart data={decisionsData} />}
              {categoriesData && <CategoriesChart data={categoriesData} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
