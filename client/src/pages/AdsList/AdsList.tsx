import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MdSearch,
  MdFolder,
  MdCalendarToday,
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage,
  MdLocalFireDepartment
} from 'react-icons/md';
import { useAds } from '@hooks/useAds';
import { adsService } from '@services/api';
import type { AdsFilters, AdStatus, Advertisement, RejectReason } from '@/types';
import { CATEGORIES, AD_STATUSES } from '@utils/constants.ts';
import { formatPrice, formatDate, getStatusText, getStatusColor } from '@/utils';
import styles from './AdsList.module.css';

export const AdsList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Получаем фильтры из URL
  const filtersFromUrl: AdsFilters = useMemo(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const search = searchParams.get('search') || undefined;
    const statusParam = searchParams.getAll('status');
    const status = statusParam.length > 0 ? statusParam as AdStatus[] : undefined;
    const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!, 10) : undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sortBy = (searchParams.get('sortBy') as AdsFilters['sortBy']) || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') as AdsFilters['sortOrder']) || 'desc';

    return { page, limit, search, status, categoryId, minPrice, maxPrice, sortBy, sortOrder };
  }, [searchParams]);

  const [searchInput, setSearchInput] = useState(filtersFromUrl.search || '');

  // Состояние для bulk-операций
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState<RejectReason | ''>('');
  const [rejectComment, setRejectComment] = useState('');

  // Ref для поля поиска
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Загружаем данные
  const { data, isLoading, isError, error } = useAds(filtersFromUrl);

  // Обновление фильтров в URL
  const updateFilters = (updates: Partial<AdsFilters>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.delete(key);
        value.forEach(v => newParams.append(key, String(v)));
      } else {
        newParams.set(key, String(value));
      }
    });

    // При изменении фильтров сбрасываем на первую страницу
    if (!updates.page) {
      newParams.set('page', '1');
    }

    setSearchParams(newParams);
  };

  const handleSearch = () => {
    updateFilters({ search: searchInput || undefined });
  };

  const handleStatusToggle = (status: AdStatus) => {
    const currentStatuses = filtersFromUrl.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];

    updateFilters({ status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const handleAdClick = (id: number) => {
    if (!isBulkMode) {
      navigate(`/item/${id}`);
    }
  };

  // Функции для bulk-операций
  const toggleSelectAd = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllOnPage = () => {
    if (data?.ads) {
      setSelectedIds(new Set(data.ads.map(ad => ad.id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0 || isProcessing) return;

    const confirmed = window.confirm(
      `Вы уверены, что хотите одобрить ${selectedIds.size} объявлений?`
    );

    if (!confirmed) return;

    setIsProcessing(true);

    try {
      const ids = Array.from(selectedIds);
      const result = await adsService.bulkApprove(ids);

      if (result.success > 0) {
        alert(
          `Успешно одобрено: ${result.success} объявлений${
            result.failed > 0 ? `\nОшибок: ${result.failed}` : ''
          }`
        );

        // Сбрасываем выбор и обновляем данные
        clearSelection();
        window.location.reload(); // Простое решение для обновления данных
      }
    } catch (error) {
      console.error('Ошибка массового одобрения:', error);
      alert('Произошла ошибка при массовом одобрении объявлений');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkReject = () => {
    if (selectedIds.size === 0 || isProcessing) return;
    setShowRejectModal(true);
  };

  const confirmBulkReject = async () => {
    if (!rejectReason) {
      alert('Необходимо указать причину отклонения');
      return;
    }

    setIsProcessing(true);
    setShowRejectModal(false);

    try {
      const ids = Array.from(selectedIds);
      const result = await adsService.bulkReject(ids, {
        reason: rejectReason as RejectReason,
        comment: rejectComment || undefined,
      });

      if (result.success > 0) {
        alert(
          `Успешно отклонено: ${result.success} объявлений${
            result.failed > 0 ? `\nОшибок: ${result.failed}` : ''
          }`
        );

        // Сбрасываем выбор и обновляем данные
        clearSelection();
        setRejectReason('');
        setRejectComment('');
        window.location.reload(); // Простое решение для обновления данных
      }
    } catch (error) {
      console.error('Ошибка массового отклонения:', error);
      alert('Произошла ошибка при массовом отклонении объявлений');
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelBulkReject = () => {
    setShowRejectModal(false);
    setRejectReason('');
    setRejectComment('');
  };

  // Обработка горячих клавиш
  const hotkeys = useRef<{ [key: string]: () => void }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const action = hotkeys.current[e.key];
      if (action) {
        e.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Пример привязки горячих клавиш
  useEffect(() => {
    hotkeys.current['/'] = () => {
      // Фокус на поле поиска
      searchInputRef.current?.focus();
    };

    hotkeys.current['ArrowLeft'] = () => {
      // Предыдущая страница
      if (data && data.pagination.currentPage > 1) {
        updateFilters({ page: data.pagination.currentPage - 1 });
      }
    };

    hotkeys.current['ArrowRight'] = () => {
      // Следующая страница
      if (data && data.pagination.currentPage < data.pagination.totalPages) {
        updateFilters({ page: data.pagination.currentPage + 1 });
      }
    };

    hotkeys.current['Control+f'] = () => {
      // Открыть фильтры
      console.log('Открыть фильтры');
    };

    hotkeys.current['Control+r'] = () => {
      // Сбросить фильтры
      handleResetFilters();
    };

    hotkeys.current['Control+s'] = () => {
      // Поиск
      handleSearch();
    };
  }, [handleResetFilters, handleSearch, data, updateFilters]);

  return (
    <div className={styles.page}>
      {/* Hero секция */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div>
            <h1 className={styles.heroTitle}>Модерация объявлений</h1>
            <p className={styles.heroSubtitle}>Управление и проверка объявлений платформы Авито</p>
          </div>
          <img src='src/assets/Layer.svg' alt="Avito Tech Layer" className={styles.LayerImage}/>
        </div>
      </div>

      {/* Основной контент */}
      <div className={styles.container}>
        {/* Боковая панель с фильтрами */}
        <aside className={styles.sidebar}>
          <div className={styles.filters}>
            <div className={styles.filtersHeader}>
              <h3 className={styles.filtersTitle}>Фильтры</h3>
              <button onClick={handleResetFilters} className={styles.resetBtn}>
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
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Название объявления..."
                  className={styles.filterInput}
                  ref={searchInputRef}
                />
                <button onClick={handleSearch} className={styles.searchBtn}>
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
                      checked={filtersFromUrl.status?.includes(status) || false}
                      onChange={() => handleStatusToggle(status)}
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
                value={filtersFromUrl.categoryId ?? ''}
                onChange={(e) => updateFilters({ categoryId: e.target.value ? parseInt(e.target.value) : undefined })}
                className={styles.filterSelect}
              >
                <option value="">Все категории</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                  value={filtersFromUrl.minPrice ?? ''}
                  onChange={(e) => updateFilters({ minPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className={`${styles.filterInput} ${styles.filterInputSmall}`}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="До"
                  value={filtersFromUrl.maxPrice ?? ''}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className={`${styles.filterInput} ${styles.filterInputSmall}`}
                />
              </div>
            </div>

            {/* Сортировка */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Сортировка</label>
              <div className={styles.sortGroup}>
                <select
                  value={filtersFromUrl.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value as AdsFilters['sortBy'] })}
                  className={styles.filterSelect}
                >
                  <option value="createdAt">По дате</option>
                  <option value="price">По цене</option>
                  <option value="priority">По приоритету</option>
                </select>
                <select
                  value={filtersFromUrl.sortOrder}
                  onChange={(e) => updateFilters({ sortOrder: e.target.value as AdsFilters['sortOrder'] })}
                  className={styles.filterSelect}
                >
                  <option value="desc">По убыванию</option>
                  <option value="asc">По возрастанию</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Список объявлений */}
        <main className={styles.main}>
          {/* Заголовок и инфо */}
          {data && (
            <div className={styles.info}>
              <h2 className={styles.infoTitle}>Объявления</h2>
              <div className={styles.infoRight}>
                <p className={styles.count}>
                  Найдено: <strong>{data.pagination.totalItems}</strong> объявлений
                </p>
                <button
                  onClick={() => setIsBulkMode(!isBulkMode)}
                  className={`${styles.bulkModeBtn} ${isBulkMode ? styles.active : ''}`}
                >
                  {isBulkMode ? 'Отменить выбор' : 'Выбрать несколько'}
                </button>
              </div>
            </div>
          )}

          {/* Панель bulk-операций */}
          {isBulkMode && selectedIds.size > 0 && (
            <div className={styles.bulkPanel}>
              <div className={styles.bulkInfo}>
                <span className={styles.bulkCount}>
                  Выбрано: <strong>{selectedIds.size}</strong>
                </span>
                <button onClick={selectAllOnPage} className={styles.bulkSelectAll}>
                  Выбрать все на странице
                </button>
                <button onClick={clearSelection} className={styles.bulkClear}>
                  Снять выделение
                </button>
              </div>
              <div className={styles.bulkActions}>
                <button onClick={handleBulkApprove} className={styles.bulkApprove}>
                  Одобрить выбранные
                </button>
                <button onClick={handleBulkReject} className={styles.bulkReject}>
                  Отклонить выбранные
                </button>
              </div>
            </div>
          )}

          {/* Загрузка */}
          {isLoading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Загрузка объявлений...</p>
            </div>
          )}

          {/* Ошибка */}
          {isError && (
            <div className={styles.error}>
              <p>Ошибка загрузки: {error?.message || 'Неизвестная ошибка'}</p>
            </div>
          )}

          {/* Список карточек */}
          {data && data.ads.length > 0 && (
            <>
              <div className={styles.grid}>
                {data.ads.map((ad: Advertisement) => (
                  <div
                    key={ad.id}
                    className={`${styles.card} ${selectedIds.has(ad.id) ? styles.selected : ''} ${isBulkMode ? styles.bulkModeCard : ''}`}
                    onClick={() => handleAdClick(ad.id)}
                  >
                    {isBulkMode && (
                      <div className={styles.checkboxWrapper}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(ad.id)}
                          onChange={(e) => toggleSelectAd(ad.id, e as any)}
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
                ))}
              </div>

              {/* Пагинация */}
              <div className={styles.pagination}>
                <button
                  onClick={() => updateFilters({ page: 1 })}
                  disabled={data.pagination.currentPage === 1}
                  className={styles.paginationBtn}
                >
                  <MdFirstPage /> <span>Первая</span>
                </button>
                <button
                  onClick={() => updateFilters({ page: data.pagination.currentPage - 1 })}
                  disabled={data.pagination.currentPage === 1}
                  className={styles.paginationBtn}
                >
                  <MdChevronLeft /> <span>Назад</span>
                </button>
                <span className={styles.paginationInfo}>
                  Страница {data.pagination.currentPage} из {data.pagination.totalPages}
                </span>
                <button
                  onClick={() => updateFilters({ page: data.pagination.currentPage + 1 })}
                  disabled={data.pagination.currentPage === data.pagination.totalPages}
                  className={styles.paginationBtn}
                >
                  <span>Вперёд</span> <MdChevronRight />
                </button>
                <button
                  onClick={() => updateFilters({ page: data.pagination.totalPages })}
                  disabled={data.pagination.currentPage === data.pagination.totalPages}
                  className={styles.paginationBtn}
                >
                  <span>Последняя</span> <MdLastPage />
                </button>
              </div>
            </>
          )}

          {/* Пустой результат */}
          {data && data.ads.length === 0 && (
            <div className={styles.empty}>
              <p>Объявления не найдены</p>
              <button onClick={handleResetFilters} className={styles.emptyBtn}>
                Сбросить фильтры
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Модальное окно для массового отклонения */}
      {showRejectModal && (
        <div className={styles.modal} onClick={cancelBulkReject}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Отклонение объявлений</h2>
            <p className={styles.modalSubtitle}>
              Вы собираетесь отклонить {selectedIds.size} объявлений
            </p>

            <div className={styles.modalGroup}>
              <label className={styles.modalLabel}>
                Причина отклонения <span className={styles.required}>*</span>
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value as RejectReason | '')}
                className={styles.modalSelect}
              >
                <option value="">Выберите причину</option>
                <option value="Запрещенный товар">Запрещённый товар</option>
                <option value="Неверная категория">Неверная категория</option>
                <option value="Некорректное описание">Некорректное описание</option>
                <option value="Проблемы с фото">Проблемы с фото</option>
                <option value="Подозрение на мошенничество">Подозрение на мошенничество</option>
                <option value="Другое">Другое</option>
              </select>
            </div>

            <div className={styles.modalGroup}>
              <label className={styles.modalLabel}>Комментарий (необязательно)</label>
              <textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                placeholder="Дополнительный комментарий..."
                className={styles.modalTextarea}
                rows={4}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={confirmBulkReject}
                className={styles.modalConfirm}
                disabled={!rejectReason || isProcessing}
              >
                {isProcessing ? 'Обработка...' : 'Отклонить'}
              </button>
              <button
                onClick={cancelBulkReject}
                className={styles.modalCancel}
                disabled={isProcessing}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
