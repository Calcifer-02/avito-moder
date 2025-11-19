import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MdArrowBack,
  MdChevronLeft,
  MdChevronRight,
  MdCheckCircle,
  MdCancel,
  MdWarning,
  MdClose,
  MdLocalFireDepartment,
  MdStar,
  MdPerson
} from 'react-icons/md';
import { useAd, useApproveAd, useRejectAd, useRequestChanges } from '@hooks/useAds';
import { formatPrice, formatDateTime, getStatusText, getStatusColor, getPriorityText } from '../../utils';
import { REJECTION_REASONS } from '@utils/constants.ts';
import type { RejectReason } from '@/types';
import styles from './AdDetail.module.css';

export const AdDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const adId = parseInt(id!, 10);

  // Загружаем данные объявления
  const { data: ad, isLoading, isError } = useAd(adId);

  // Мутации для модерации
  const approveMutation = useApproveAd();
  const rejectMutation = useRejectAd();
  const requestChangesMutation = useRequestChanges();

  // Состояние модалок
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<RejectReason | ''>('');
  const [comment, setComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Горячие клавиши
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Игнорируем, если фокус на input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'a':
          handleApprove();
          break;
        case 'd':
          setShowRejectModal(true);
          break;
        case 'arrowleft':
          handlePrevAd();
          break;
        case 'arrowright':
          handleNextAd();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [ad]);

  const handleApprove = () => {
    if (!ad || ad.status === 'approved') return;
    approveMutation.mutate(adId, {
      onSuccess: () => {
        alert('Объявление одобрено');
      },
    });
  };

  const handleReject = () => {
    if (!selectedReason) {
      alert('Пожалуйста, выберите причину отклонения');
      return;
    }

    rejectMutation.mutate(
      { id: adId, data: { reason: selectedReason as RejectReason, comment } },
      {
        onSuccess: () => {
          alert('Объявление отклонено');
          setShowRejectModal(false);
          setSelectedReason('');
          setComment('');
        },
      }
    );
  };

  const handleRequestChanges = () => {
    if (!selectedReason) {
      alert('Пожалуйста, выберите причину');
      return;
    }

    requestChangesMutation.mutate(
      { id: adId, data: { reason: selectedReason as RejectReason, comment } },
      {
        onSuccess: () => {
          alert('⚠️ Запрос на доработку отправлен');
          setShowRequestChangesModal(false);
          setSelectedReason('');
          setComment('');
        },
      }
    );
  };

  const handlePrevAd = () => {
    if (adId > 1) {
      navigate(`/item/${adId - 1}`);
    }
  };

  const handleNextAd = () => {
    navigate(`/item/${adId + 1}`);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка объявления...</p>
      </div>
    );
  }

  if (isError || !ad) {
    return (
      <div className={styles.error}>
        <h2>Объявление не найдено</h2>
        <Link to="/list" className={styles.backBtn}>
          <MdArrowBack /> Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Навигация */}
      <div className={styles.nav}>
        <div className={styles.navContent}>
          <Link to="/list" className={styles.navBtn}>
            <MdArrowBack /> Назад к списку
          </Link>
          <div className={styles.navQuick}>
            <button onClick={handlePrevAd} disabled={adId <= 1} className={styles.navArrowBtn}>
              <MdChevronLeft /> Предыдущее
            </button>
            <button onClick={handleNextAd} className={styles.navArrowBtn}>
              Следующее <MdChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className={styles.container}>
        {/* Левая колонка - галерея и описание */}
        <div className={styles.main}>
          {/* Галерея изображений */}
          <div className={styles.gallery}>
            <div className={styles.galleryMain}>
              <img src={ad.images[currentImageIndex]} alt={ad.title} />
              {ad.priority === 'urgent' && (
                <div className={styles.priorityBadge}>
                  <MdLocalFireDepartment /> Срочное
                </div>
              )}
            </div>
            <div className={styles.galleryThumbs}>
              {ad.images.map((img: string, index: number) => (
                <div
                  key={index}
                  className={`${styles.thumb} ${index === currentImageIndex ? styles.active : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={img} alt={`${ad.title} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Информация об объявлении */}
          <div className={styles.infoSection}>
            <div className={styles.header}>
              <div>
                <h1>{ad.title}</h1>
                <p className={styles.price}>{formatPrice(ad.price)}</p>
              </div>
              <div
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(ad.status) }}
              >
                {getStatusText(ad.status)}
              </div>
            </div>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Категория:</span>
                <span className={styles.metaValue}>{ad.category}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Приоритет:</span>
                <span className={styles.metaValue}>{getPriorityText(ad.priority)}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Создано:</span>
                <span className={styles.metaValue}>{formatDateTime(ad.createdAt)}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Обновлено:</span>
                <span className={styles.metaValue}>{formatDateTime(ad.updatedAt)}</span>
              </div>
            </div>

            <div className={styles.description}>
              <h3>Описание</h3>
              <p>{ad.description}</p>
            </div>

            <div className={styles.characteristics}>
              <h3>Характеристики</h3>
              <table>
                <tbody>
                  {Object.entries(ad.characteristics).map(([key, value]) => (
                    <tr key={key}>
                      <td className={styles.charKey}>{key}</td>
                      <td className={styles.charValue}>{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* История модерации */}<div className={styles.history}>
            <h3>История модерации</h3>
            {ad.moderationHistory.length === 0 ? (
              <p className={styles.noHistory}>Действий пока не было</p>
            ) : (
              <div className={styles.timeline}>
                {ad.moderationHistory.map((item: { id: number; moderatorName: string; action: string; timestamp: string; reason?: string | null; comment?: string }) => (
                  <div key={item.id} className={styles.historyItem}>
                    <div className={styles.historyIcon}>
                      {item.action === 'approved' && <MdCheckCircle style={{ color: '#4CAF50' }} />}
                      {item.action === 'rejected' && <MdCancel style={{ color: '#F44336' }} />}
                      {item.action === 'requestChanges' && <MdWarning style={{ color: '#FF9800' }} />}
                    </div>
                    <div className={styles.historyContent}>
                      <div className={styles.historyHeader}>
                        <strong>{item.moderatorName}</strong>
                        <span className={styles.historyTime}>{formatDateTime(item.timestamp)}</span>
                      </div>
                      <div className={styles.historyAction}>
                        {item.action === 'approved' && 'Одобрил объявление'}
                        {item.action === 'rejected' && 'Отклонил объявление'}
                        {item.action === 'requestChanges' && 'Запросил изменения'}
                      </div>
                      {item.reason && (
                        <div className={styles.historyReason}>Причина: {item.reason}</div>
                      )}
                      {item.comment && (
                        <div className={styles.historyComment}>{item.comment}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка - продавец и действия */}
        <aside className={styles.sidebar}>
          {/* Информация о продавце */}
          <div className={styles.sellerCard}>
            <h3>Продавец</h3>
            <div className={styles.sellerInfo}>
              <div className={styles.sellerAvatar}>
                <MdPerson />
              </div>
              <div className={styles.sellerDetails}>
                <div className={styles.sellerName}>{ad.seller.name}</div>
                <div className={styles.sellerRating}>
                  <MdStar style={{ color: '#FFA500' }} /> {ad.seller.rating}
                </div>
              </div>
            </div>
            <div className={styles.sellerStats}>
              <div className={styles.sellerStat}>
                <span className={styles.sellerStatLabel}>Объявлений:</span>
                <span className={styles.sellerStatValue}>{ad.seller.totalAds}</span>
              </div>
              <div className={styles.sellerStat}>
                <span className={styles.sellerStatLabel}>На платформе:</span>
                <span className={styles.sellerStatValue}>
                  {formatDateTime(ad.seller.registeredAt).split(',')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Панель действий модератора */}
          <div className={styles.moderationPanel}>
            <h3>Действия модератора</h3>
            <div className={styles.moderationActions}>
              <button
                onClick={handleApprove}
                disabled={ad.status === 'approved' || approveMutation.isPending}
                className={`${styles.modBtn} ${styles.modBtnApprove}`}
              >
                <MdCheckCircle /> Одобрить
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={ad.status === 'rejected' || rejectMutation.isPending}
                className={`${styles.modBtn} ${styles.modBtnReject}`}
              >
                <MdCancel /> Отклонить
              </button>
              <button
                onClick={() => setShowRequestChangesModal(true)}
                disabled={requestChangesMutation.isPending}
                className={`${styles.modBtn} ${styles.modBtnRequest}`}
              >
                <MdWarning /> Вернуть на доработку
              </button>
            </div>
            <div className={styles.hint}>
              <strong>Горячие клавиши:</strong>
              <ul>
                <li><kbd>A</kbd> - Одобрить</li>
                <li><kbd>D</kbd> - Отклонить</li>
                <li><kbd>←</kbd> <kbd>→</kbd> - Навигация</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Модалка отклонения */}
      {showRejectModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRejectModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Отклонить объявление</h3>
              <button onClick={() => setShowRejectModal(false)} className={styles.modalClose}>
                <MdClose />
              </button>
            </div>
            <div className={styles.modalBody}>
              <label>Причина отклонения *</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value as RejectReason)}
                className={styles.modalSelect}
              >
                <option value="">Выберите причину</option>
                {REJECTION_REASONS.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>

              <label>Комментарий</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Дополнительные пояснения..."
                className={styles.modalTextarea}
                rows={4}
              />
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowRejectModal(false)} className={`${styles.modalBtn} ${styles.modalBtnCancel}`}>
                Отмена
              </button>
              <button onClick={handleReject} className={`${styles.modalBtn} ${styles.modalBtnReject}`}>
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка запроса изменений */}
      {showRequestChangesModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRequestChangesModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Запросить изменения</h3>
              <button onClick={() => setShowRequestChangesModal(false)} className={styles.modalClose}>
                <MdClose />
              </button>
            </div>
            <div className={styles.modalBody}>
              <label>Причина *</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value as RejectReason)}
                className={styles.modalSelect}
              >
                <option value="">Выберите причину</option>
                {REJECTION_REASONS.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>

              <label>Комментарий</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Что нужно исправить..."
                className={styles.modalTextarea}
                rows={4}
              />
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowRequestChangesModal(false)} className={`${styles.modalBtn} ${styles.modalBtnCancel}`}>
                Отмена
              </button>
              <button onClick={handleRequestChanges} className={`${styles.modalBtn} ${styles.modalBtnRequest}`}>
                Отправить запрос
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

