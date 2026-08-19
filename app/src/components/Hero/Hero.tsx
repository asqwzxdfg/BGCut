import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Hero.module.css';

interface HeroProps {
  onScrollToUpload: () => void;
  showVisual: boolean;
  onStartClick: () => void;
}

export default function Hero({ onScrollToUpload, showVisual, onStartClick }: HeroProps) {
  const { t } = useLanguage();

  const handleClick = () => {
    onStartClick();
    setTimeout(() => {
      onScrollToUpload();
    }, 100);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>{t.hero.badge}</span>
          <h1 className={styles.title}>{t.hero.title}</h1>
          <p className={styles.subtitle}>{t.hero.subtitle}</p>
          <button className={styles.ctaButton} onClick={handleClick}>
            {t.hero.cta}
          </button>
        </div>

        <div className={`${styles.visual} ${!showVisual ? styles.visualHidden : ''}`}>
          <div className={styles.imageCard}>
            <div className={styles.beforeImage}>
              <div className={styles.toasterPlaceholder}>
                <span className={styles.placeholderEmoji}>🍞</span>
              </div>
              <span className={styles.imageLabel}>{t.hero.before}</span>
            </div>
            <span className={styles.arrow}>→</span>
            <div className={styles.afterImage}>
              <div className={styles.checkerboard}>
                <div className={styles.toasterPlaceholder}>
                  <span className={styles.placeholderEmoji}>🍞</span>
                </div>
              </div>
              <span className={styles.imageLabel}>{t.hero.after}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
