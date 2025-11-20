import { MdLocalFireDepartment } from 'react-icons/md';
import styles from './ImageGallery.module.css';

interface ImageGalleryProps {
  images: string[];
  title: string;
  priority?: 'normal' | 'urgent';
  currentIndex: number;
  onImageChange: (index: number) => void;
}

export const ImageGallery = ({ images, title, priority, currentIndex, onImageChange }: ImageGalleryProps) => {
  return (
    <div className={styles.gallery}>
      <div className={styles.galleryMain}>
        <img src={images[currentIndex]} alt={title} />
        {priority === 'urgent' && (
          <div className={styles.priorityBadge}>
            <MdLocalFireDepartment /> Срочное
          </div>
        )}
      </div>
      <div className={styles.galleryThumbs}>
        {images.map((img: string, index: number) => (
          <div
            key={index}
            className={`${styles.thumb} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => onImageChange(index)}
          >
            <img src={img} alt={`${title} ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

