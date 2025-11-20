import { MdPerson, MdStar } from 'react-icons/md';
import { formatDateTime } from '../../../utils';
import styles from './SellerCard.module.css';

interface Seller {
  name: string;
  rating: string;
  totalAds: number;
  registeredAt: string;
}

interface SellerCardProps {
  seller: Seller;
}

export const SellerCard = ({ seller }: SellerCardProps) => {
  return (
    <div className={styles.sellerCard}>
      <h3>Продавец</h3>
      <div className={styles.sellerInfo}>
        <div className={styles.sellerAvatar}>
          <MdPerson />
        </div>
        <div className={styles.sellerDetails}>
          <div className={styles.sellerName}>{seller.name}</div>
          <div className={styles.sellerRating}>
            <MdStar style={{ color: '#FFA500' }} /> {seller.rating}
          </div>
        </div>
      </div>
      <div className={styles.sellerStats}>
        <div className={styles.sellerStat}>
          <span className={styles.sellerStatLabel}>Объявлений:</span>
          <span className={styles.sellerStatValue}>{seller.totalAds}</span>
        </div>
        <div className={styles.sellerStat}>
          <span className={styles.sellerStatLabel}>На платформе:</span>
          <span className={styles.sellerStatValue}>
            {formatDateTime(seller.registeredAt).split(',')[0]}
          </span>
        </div>
      </div>
    </div>
  );
};

