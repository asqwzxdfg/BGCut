import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { ProcessingResult } from '../../types';
import styles from './ComparisonSlider.module.css';

interface ComparisonSliderProps {
  result: ProcessingResult | null;
  onClose: () => void;
}

export default function ComparisonSlider({ result, onClose }: ComparisonSliderProps) {
  const { t } = useLanguage();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 배경 옵션에 따른 스타일 계산
  const bgOption = result?.backgroundOption || { type: 'transparent' };
  
  const backgroundStyle = useMemo(() => {
    if (bgOption.type === 'color' && bgOption.color) {
      return { backgroundColor: bgOption.color };
    }
    if (bgOption.type === 'image' && bgOption.imageUrl) {
      const settings = bgOption.imageSettings || { x: 50, y: 50, scale: 1, opacity: 1 };
      return { 
        backgroundImage: `url(${bgOption.imageUrl})`,
        backgroundSize: `${settings.scale * 100}%`,
        backgroundPosition: `${settings.x}% ${settings.y}%`,
        opacity: settings.opacity,
      };
    }
    return {};
  }, [bgOption]);

  const isTransparent = bgOption.type === 'transparent';

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!result) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>{t.comparison.title}</h2>
          <p className={styles.subtitle}>{t.comparison.subtitle}</p>
        </div>

        <div
          ref={containerRef}
          className={styles.sliderContainer}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* 원본 이미지 (왼쪽) */}
          <div className={styles.originalImage}>
            <img src={result.originalPreview} alt={t.comparison.original} />
            <span className={styles.label}>{t.comparison.original}</span>
          </div>

          {/* 결과 이미지 (오른쪽) - 커스텀 배경 적용 */}
          <div
            className={styles.resultImage}
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            <div 
              className={`${styles.resultBackground} ${isTransparent ? styles.checkerboard : ''}`}
              style={!isTransparent ? backgroundStyle : {}}
            >
              <img src={result.resultUrl} alt={t.comparison.result} />
            </div>
            <span className={styles.label}>{t.comparison.result}</span>
          </div>

          {/* 슬라이더 핸들 */}
          <div
            className={styles.sliderLine}
            style={{ left: `${sliderPosition}%` }}
          >
            <div className={styles.sliderHandle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
