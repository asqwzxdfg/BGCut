import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Hero.module.css';

interface HeroProps {
  showVisual: boolean;
  onStartClick: () => void;
}

// 예시 슬라이더 데이터
const EXAMPLE_SLIDES = [
  { original: '/example-original.jpg', result: '/example-result.png' },
  { original: '/example-original.jpg', result: '/example-result.png' },
  { original: '/example-original.jpg', result: '/example-result.png' },
];

export default function Hero({ showVisual, onStartClick }: HeroProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sliderPositions, setSliderPositions] = useState<number[]>(EXAMPLE_SLIDES.map(() => 50));
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const sliderRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleClick = () => {
    onStartClick();
    navigate('/editor');
  };

  // 휠 이벤트로 애니메이션 제어
  useEffect(() => {
    let currentProgress = 0;
    let targetProgress = 0;
    let animationId: number;

    const animate = () => {
      // 더 부드러운 보간 (0.05로 천천히)
      currentProgress += (targetProgress - currentProgress) * 0.05;
      
      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }
      
      setScrollProgress(currentProgress);
      animationId = requestAnimationFrame(animate);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // 스크롤 요구량 증가 (0.0008로 더 천천히)
      const delta = e.deltaY * 0.0008;
      // 마지막 슬라이더가 완전히 보이는 지점(2.3)에서 멈춤
      targetProgress = Math.min(2.3, Math.max(0, targetProgress + delta));
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('wheel', handleWheel, { passive: false });
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('wheel', handleWheel);
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleMove = useCallback((clientX: number, index: number) => {
    const sliderEl = sliderRefs.current[index];
    if (!sliderEl) return;
    const rect = sliderEl.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = percentage;
      return newPositions;
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setDraggingIndex(index);
    handleMove(e.clientX, index);
  }, [handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggingIndex === null) return;
    handleMove(e.clientX, draggingIndex);
  }, [draggingIndex, handleMove]);

  const handleMouseUp = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent, index: number) => {
    setDraggingIndex(index);
    handleMove(e.touches[0].clientX, index);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (draggingIndex === null) return;
    handleMove(e.touches[0].clientX, draggingIndex);
  }, [draggingIndex, handleMove]);

  useEffect(() => {
    if (draggingIndex !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [draggingIndex, handleMouseMove, handleMouseUp, handleTouchMove]);

  // 메인 콘텐츠 애니메이션 (0 ~ 0.5 구간)
  const contentProgress = Math.min(1, scrollProgress * 2);
  const contentOpacity = Math.max(0, 1 - contentProgress * 1.5);
  const contentY = contentProgress * -150; // 위로 이동
  const contentScale = 1 - contentProgress * 0.15;

  // 스크롤 힌트 (0 ~ 0.3 구간에서 사라짐)
  const hintOpacity = Math.max(0, 1 - scrollProgress * 4);

  // 각 슬라이더의 애니메이션 계산
  const getSliderStyle = (index: number) => {
    // 각 슬라이더는 0.7 간격으로 등장 (더 긴 간격)
    const startAt = 0.3 + index * 0.7;
    const localProgress = Math.max(0, Math.min(1, (scrollProgress - startAt) / 0.5));
    
    // 마지막 슬라이더가 아닌 경우에만 퇴장 애니메이션
    const isLast = index === EXAMPLE_SLIDES.length - 1;
    const exitProgress = isLast ? 0 : Math.max(0, Math.min(1, (scrollProgress - startAt - 0.5) / 0.4));
    
    // 등장: 아래에서 위로, 투명에서 불투명
    const enterY = (1 - localProgress) * 150;
    const enterOpacity = localProgress;
    const enterScale = 0.85 + localProgress * 0.15;
    
    // 퇴장: 위로 올라가면서 사라짐 (마지막 슬라이더는 제외)
    const exitY = exitProgress * -150;
    const exitOpacity = 1 - exitProgress;
    
    const finalY = enterY + exitY;
    const finalOpacity = Math.min(enterOpacity, exitOpacity);
    const finalScale = enterScale * (1 - exitProgress * 0.1);
    
    return {
      opacity: finalOpacity,
      transform: `translate(-50%, -50%) translateY(${finalY}px) scale(${finalScale})`,
      pointerEvents: (finalOpacity > 0.3 ? 'auto' : 'none') as 'auto' | 'none',
      zIndex: EXAMPLE_SLIDES.length - index,
    };
  };

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.container}>
        {/* 메인 콘텐츠 */}
        <div 
          className={styles.content}
          style={{
            opacity: contentOpacity,
            transform: `translate(-50%, -50%) translateY(${contentY}px) scale(${contentScale})`,
            pointerEvents: contentOpacity > 0.3 ? 'auto' : 'none',
          }}
        >
          <span className={styles.badge}>{t.hero.badge}</span>
          <h1 className={styles.title}>{t.hero.title}</h1>
          <p className={styles.subtitle}>{t.hero.subtitle}</p>
          <button className={styles.ctaButton} onClick={handleClick}>
            {t.hero.cta}
          </button>
        </div>

        {/* 예시 슬라이더들 */}
        <div className={styles.slidersWrapper}>
          {showVisual && EXAMPLE_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={styles.sliderContainer}
              style={getSliderStyle(index)}
            >
              <div 
                ref={el => { sliderRefs.current[index] = el; }}
                className={styles.comparisonSlider}
                onMouseDown={(e) => handleMouseDown(e, index)}
                onTouchStart={(e) => handleTouchStart(e, index)}
              >
                <div className={styles.originalSide}>
                  <img src={slide.original} alt={t.hero.before} />
                  <span className={styles.imageLabel}>{t.hero.before}</span>
                </div>

                <div 
                  className={styles.resultSide}
                  style={{ clipPath: `inset(0 0 0 ${sliderPositions[index]}%)` }}
                >
                  <div className={styles.checkerboard}>
                    <img src={slide.result} alt={t.hero.after} />
                  </div>
                  <span className={styles.imageLabel}>{t.hero.after}</span>
                </div>

                <div 
                  className={styles.sliderLine}
                  style={{ left: `${sliderPositions[index]}%` }}
                >
                  <div className={styles.sliderHandle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <p className={styles.sliderCaption}>
                {index === 0 && (t.hero.example1 || '인물 사진 배경 제거')}
                {index === 1 && (t.hero.example2 || '상품 이미지 누끼')}
                {index === 2 && (t.hero.example3 || '로고/아이콘 배경 제거')}
              </p>
            </div>
          ))}
        </div>

        {/* 스크롤 힌트 */}
        <div 
          className={styles.scrollHint}
          style={{ 
            opacity: hintOpacity,
            pointerEvents: hintOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          <span>{t.hero.scrollHint}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </section>
  );
}
