import styles from './Hero.module.css';

interface HeroProps {
  onScrollToUpload: () => void;
  showVisual: boolean;
  onStartClick: () => void;
}

export default function Hero({ onScrollToUpload, showVisual, onStartClick }: HeroProps) {
  const handleClick = () => {
    onStartClick();
    // 약간의 딜레이 후 스크롤
    setTimeout(() => {
      onScrollToUpload();
    }, 100);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>배경 지우개 정식 출시 ⚡</span>
          <h1 className={styles.title}>
            이미지 배경을 제거해줄게요
          </h1>
          <p className={styles.subtitle}>
            드래그 앤 드롭으로 간편하게, 여러 이미지도 한 번에 처리해요 ✨
          </p>
          <button className={styles.ctaButton} onClick={handleClick}>
            지금 시작하기
          </button>
        </div>

        <div className={`${styles.visual} ${!showVisual ? styles.visualHidden : ''}`}>
          <div className={styles.imageCard}>
            <div className={styles.beforeImage}>
              <div className={styles.toasterPlaceholder}>
                <span className={styles.placeholderEmoji}>🍞</span>
              </div>
              <span className={styles.imageLabel}>원본 이미지</span>
            </div>
            <span className={styles.arrow}>→</span>
            <div className={styles.afterImage}>
              <div className={styles.checkerboard}>
                <div className={styles.toasterPlaceholder}>
                  <span className={styles.placeholderEmoji}>🍞</span>
                </div>
              </div>
              <span className={styles.imageLabel}>배경 제거 완료 ✨</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
