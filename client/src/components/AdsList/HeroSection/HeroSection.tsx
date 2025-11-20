import styles from './HeroSection.module.css';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageSrc?: string;
}

export const HeroSection = ({ title, subtitle, imageSrc }: HeroSectionProps) => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <div>
          <h1 className={styles.heroTitle}>{title}</h1>
          <p className={styles.heroSubtitle}>{subtitle}</p>
        </div>
        {imageSrc && (
          <img src={imageSrc} alt="Avito Tech Layer" className={styles.layerImage} />
        )}
      </div>
    </div>
  );
};

