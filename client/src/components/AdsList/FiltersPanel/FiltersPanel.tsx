import { MdSearch } from 'react-icons/md';
import type { AdsFilters, AdStatus } from '../../../types';
import { CATEGORIES, AD_STATUSES } from '../../../utils/constants';
import { getStatusText } from '../../../utils';
import styles from './FiltersPanel.module.css';

interface FiltersPanelProps {
  filters: AdsFilters;
  searchInput: string;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onStatusToggle: (status: AdStatus) => void;
  onFilterChange: (updates: Partial<AdsFilters>) => void;
  onReset: () => void;
}

export const FiltersPanel = ({
  filters,
  searchInput,
  searchInputRef,
  onSearchChange,
  onSearch,
  onStatusToggle,
  onFilterChange,
  onReset,
}: FiltersPanelProps) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.filters}>
        <div className={styles.filtersHeader}>
          <h3 className={styles.filtersTitle}>Фильтры</h3>
          <button onClick={onReset} className={styles.resetBtn}>
            Сбросить
          </button>
        </div>

        {/* Поиск */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Поиск</label>
          <div className={styles.searchGroup}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              placeholder="Название объявления..."
              className={styles.filterInput}
              ref={searchInputRef}
            />
            <button onClick={onSearch} className={styles.searchBtn}>
              <MdSearch />
            </button>
          </div>
        </div>

        {/* Статусы */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Статус</label>
          <div className={styles.checkboxes}>
            {Object.values(AD_STATUSES).map((status) => (
              <label key={status} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.status?.includes(status) || false}
                  onChange={() => onStatusToggle(status)}
                />
                <span>{getStatusText(status)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Категории */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select
            value={filters.categoryId ?? ''}
            onChange={(e) =>
              onFilterChange({
                categoryId: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className={styles.filterSelect}
          >
            <option value="">Все категории</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Цена */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Цена</label>
          <div className={styles.priceRange}>
            <input
              type="number"
              placeholder="От"
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                onFilterChange({
                  minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              className={`${styles.filterInput} ${styles.filterInputSmall}`}
            />
            <span>—</span>
            <input
              type="number"
              placeholder="До"
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                onFilterChange({
                  maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              className={`${styles.filterInput} ${styles.filterInputSmall}`}
            />
          </div>
        </div>

        {/* Сортировка */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Сортировка</label>
          <div className={styles.sortGroup}>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({ sortBy: e.target.value as AdsFilters['sortBy'] })
              }
              className={styles.filterSelect}
            >
              <option value="createdAt">По дате</option>
              <option value="price">По цене</option>
              <option value="priority">По приоритету</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                onFilterChange({ sortOrder: e.target.value as AdsFilters['sortOrder'] })
              }
              className={styles.filterSelect}
            >
              <option value="desc">По убыванию</option>
              <option value="asc">По возрастанию</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};

