import { MdCalendarToday, MdFileDownload, MdPictureAsPdf } from 'react-icons/md';
import type { StatsPeriod } from '../../../types';
import { STATS_PERIODS } from '../../../utils/constants';
import styles from './PeriodFilter.module.css';

interface PeriodFilterProps {
  period: StatsPeriod;
  startDate: string;
  endDate: string;
  onPeriodChange: (period: StatsPeriod) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  canExport: boolean;
}

export const PeriodFilter = ({
  period,
  startDate,
  endDate,
  onPeriodChange,
  onStartDateChange,
  onEndDateChange,
  onExportCSV,
  onExportPDF,
  canExport,
}: PeriodFilterProps) => {
  return (
    <div className={styles.filter}>
      <div className={styles.filterHeader}>
        <div className={styles.periodTabs}>
          <button
            className={`${styles.periodTab} ${period === STATS_PERIODS.TODAY ? styles.active : ''}`}
            onClick={() => onPeriodChange(STATS_PERIODS.TODAY)}
          >
            <MdCalendarToday /> Сегодня
          </button>
          <button
            className={`${styles.periodTab} ${period === STATS_PERIODS.WEEK ? styles.active : ''}`}
            onClick={() => onPeriodChange(STATS_PERIODS.WEEK)}
          >
            <MdCalendarToday /> Неделя
          </button>
          <button
            className={`${styles.periodTab} ${period === STATS_PERIODS.MONTH ? styles.active : ''}`}
            onClick={() => onPeriodChange(STATS_PERIODS.MONTH)}
          >
            <MdCalendarToday /> Месяц
          </button>
          <button
            className={`${styles.periodTab} ${period === STATS_PERIODS.CUSTOM ? styles.active : ''}`}
            onClick={() => onPeriodChange(STATS_PERIODS.CUSTOM)}
          >
            <MdCalendarToday /> Произвольный
          </button>
        </div>

        <div className={styles.exportButtons}>
          <button
            onClick={onExportCSV}
            className={styles.exportBtn}
            disabled={!canExport}
            title="Экспорт в CSV"
          >
            <MdFileDownload /> CSV
          </button>
          <button
            onClick={onExportPDF}
            className={styles.exportBtnPdf}
            disabled={!canExport}
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
            onChange={(e) => onStartDateChange(e.target.value)}
            className={styles.dateInput}
          />
          <span>—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className={styles.dateInput}
          />
        </div>
      )}
    </div>
  );
};

