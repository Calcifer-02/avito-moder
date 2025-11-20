import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MdArrowBack, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useAd, useApproveAd, useRejectAd, useRequestChanges } from '@hooks/useAds';
import {
  ImageGallery,
  AdInfo,
  ModerationHistory,
  SellerCard,
  ModerationPanel,
  ModerationModal,
} from '@components/AdDetail';
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
          <ImageGallery
            images={ad.images}
            title={ad.title}
            priority={ad.priority}
            currentIndex={currentImageIndex}
            onImageChange={setCurrentImageIndex}
          />

          <AdInfo
            title={ad.title}
            price={ad.price}
            status={ad.status}
            category={ad.category}
            priority={ad.priority}
            createdAt={ad.createdAt}
            updatedAt={ad.updatedAt}
            description={ad.description}
            characteristics={ad.characteristics}
          />

          <ModerationHistory history={ad.moderationHistory} />
        </div>

        {/* Правая колонка - продавец и действия */}
        <aside className={styles.sidebar}>
          <SellerCard seller={ad.seller} />

          <ModerationPanel
            status={ad.status}
            isApproving={approveMutation.isPending}
            isRejecting={rejectMutation.isPending}
            isRequestingChanges={requestChangesMutation.isPending}
            onApprove={handleApprove}
            onReject={() => setShowRejectModal(true)}
            onRequestChanges={() => setShowRequestChangesModal(true)}
          />
        </aside>
      </div>

      {/* Модалки */}
      <ModerationModal
        isOpen={showRejectModal}
        title="Отклонить объявление"
        selectedReason={selectedReason}
        comment={comment}
        onReasonChange={setSelectedReason}
        onCommentChange={setComment}
        onConfirm={handleReject}
        onCancel={() => setShowRejectModal(false)}
        confirmLabel="Отклонить"
        confirmClassName={styles.modalBtnReject}
        placeholder="Дополнительные пояснения..."
      />

      <ModerationModal
        isOpen={showRequestChangesModal}
        title="Запросить изменения"
        selectedReason={selectedReason}
        comment={comment}
        onReasonChange={setSelectedReason}
        onCommentChange={setComment}
        onConfirm={handleRequestChanges}
        onCancel={() => setShowRequestChangesModal(false)}
        confirmLabel="Отправить запрос"
        confirmClassName={styles.modalBtnRequest}
        placeholder="Что нужно исправить..."
      />
    </div>
  );
};

