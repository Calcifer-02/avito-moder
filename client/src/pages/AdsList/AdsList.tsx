import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAds } from '@hooks/useAds';
import { adsService } from '@services/api';
import type { AdsFilters, AdStatus, Advertisement, RejectReason } from '@/types';
import {
  HeroSection,
  FiltersPanel,
  AdCard,
  BulkActionsPanel,
  Pagination,
  BulkRejectModal,
} from '@components/AdsList';
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
      <HeroSection
        title="Модерация объявлений"
        subtitle="Управление и проверка объявлений платформы Авито"
        imageSrc="public/Layer.svg"
      />

      {/* Основной контент */}
      <div className={styles.container}>
        <FiltersPanel
          filters={filtersFromUrl}
          searchInput={searchInput}
          searchInputRef={searchInputRef}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
          onStatusToggle={handleStatusToggle}
          onFilterChange={updateFilters}
          onReset={handleResetFilters}
        />

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
            <BulkActionsPanel
              selectedCount={selectedIds.size}
              isProcessing={isProcessing}
              onSelectAll={selectAllOnPage}
              onClearSelection={clearSelection}
              onApprove={handleBulkApprove}
              onReject={handleBulkReject}
            />
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
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    isSelected={selectedIds.has(ad.id)}
                    isBulkMode={isBulkMode}
                    onCardClick={handleAdClick}
                    onCheckboxChange={toggleSelectAd}
                  />
                ))}
              </div>

              {/* Пагинация */}
              <Pagination
                currentPage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={(page) => updateFilters({ page })}
              />
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
      <BulkRejectModal
        isOpen={showRejectModal}
        selectedCount={selectedIds.size}
        reason={rejectReason}
        comment={rejectComment}
        isProcessing={isProcessing}
        onReasonChange={setRejectReason}
        onCommentChange={setRejectComment}
        onConfirm={confirmBulkReject}
        onCancel={cancelBulkReject}
      />
    </div>
  );
};
