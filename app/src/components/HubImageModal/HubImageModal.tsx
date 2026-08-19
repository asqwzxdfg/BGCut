import { useEffect, useCallback } from 'react';
import { useHub } from '../../contexts/HubContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { HubImage } from '../../types';
import styles from './HubImageModal.module.css';

interface HubImageModalProps {
  image: HubImage;
  isPro: boolean;
  onClose: () => void;
  onDownload: (image: HubImage) => void;
}

export default function HubImageModal({ image, isPro, onClose, onDownload }: HubImageModalProps) {
  const { likeImage } = useHub();
  const { t } = useLanguage();
  const isKorean = t.background.transparent === '투명';

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 우클릭 방지
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  }, []);

  // 드래그 방지
  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    return false;
  }, []);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isKorean) {
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = useCallback(() => {
    likeImage(image.id);
  }, [likeImage, image.id]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.content}>
          <div 
            className={styles.imageArea}
            onContextMenu={handleContextMenu}
          >
            <img
              src={image.imageUrl}
              alt={image.title}
              className={styles.mainImage}
              onDragStart={handleDragStart}
              onContextMenu={handleContextMenu}
            />
            {/* 무단 저장 방지 투명 오버레이 */}
            <div 
              className={styles.protectedOverlay}
              onContextMenu={handleContextMenu}
            />
            {/* 무료 사용자에게는 워터마크 표시 */}
            {!isPro && (
              <div className={styles.watermark}>
                <span className={styles.watermarkText}>BGCut Pro</span>
              </div>
            )}
          </div>

          <div className={styles.sidebar}>
            <h2 className={styles.title}>{image.title}</h2>
            <p className={styles.description}>
              {image.description || (isKorean ? '설명이 없습니다.' : 'No description provided.')}
            </p>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <div className={styles.metaIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className={styles.metaContent}>
                  <span className={styles.metaLabel}>
                    {isKorean ? '제작자' : 'Creator'}
                  </span>
                  <span className={styles.metaValue}>{image.authorName}</span>
                </div>
              </div>

              <div className={styles.metaItem}>
                <div className={styles.metaIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className={styles.metaContent}>
                  <span className={styles.metaLabel}>
                    {isKorean ? '제작일' : 'Created'}
                  </span>
                  <span className={styles.metaValue}>{formatDate(image.createdAt)}</span>
                </div>
              </div>

              <div className={styles.metaItem}>
                <div className={styles.metaIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div className={styles.metaContent}>
                  <span className={styles.metaLabel}>
                    {isKorean ? '좋아요' : 'Likes'}
                  </span>
                  <span className={styles.metaValue}>{image.likes}</span>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.likeButton} onClick={handleLike}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {isKorean ? '좋아요' : 'Like'}
              </button>

              {isPro ? (
                <button 
                  className={styles.downloadButton}
                  onClick={() => onDownload(image)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {isKorean ? '원본 다운로드' : 'Download Original'}
                </button>
              ) : (
                <div className={styles.proRequired}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                  {isKorean ? 'Pro 전용 다운로드' : 'Pro Only Download'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
