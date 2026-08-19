import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HubImageModal from '../../components/HubImageModal';
import { useAuth } from '../../contexts/AuthContext';
import { useHub } from '../../contexts/HubContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { HubImage } from '../../types';
import styles from './HubPage.module.css';

export default function HubPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { images } = useHub();
  const { t } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<HubImage | null>(null);

  const isPro = user?.plan === 'pro';

  // 검색 필터링
  const filteredImages = useMemo(() => {
    if (!searchQuery.trim()) return images;
    const query = searchQuery.toLowerCase();
    return images.filter(img =>
      img.title.toLowerCase().includes(query) ||
      img.authorName.toLowerCase().includes(query) ||
      img.description.toLowerCase().includes(query)
    );
  }, [images, searchQuery]);

  const scrollToTop = useCallback(() => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

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

  const handleImageClick = useCallback((image: HubImage) => {
    setSelectedImage(image);
  }, []);

  const handleDownload = useCallback((image: HubImage) => {
    if (!isPro) {
      if (window.confirm(t.pricing.upgradeConfirm)) {
        navigate('/pricing');
      }
      return;
    }

    // Pro 사용자만 다운로드 가능
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `${image.title.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_bgcut.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [isPro, navigate, t]);

  return (
    <div className={styles.page}>
      <Header onScrollToTop={scrollToTop} />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.badge}>Hub</span>
            <h1 className={styles.title}>
              {t.background.transparent === '투명' ? '크리에이터 허브' : 'Creator Hub'}
            </h1>
            <p className={styles.subtitle}>
              {t.background.transparent === '투명' 
                ? 'Pro 크리에이터들이 공유한 작품을 만나보세요'
                : 'Discover amazing work shared by Pro creators'}
            </p>
          </div>

          <div className={styles.filterBar}>
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={t.background.transparent === '투명' ? '작품 또는 작가 검색...' : 'Search works or artists...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={styles.stats}>
              <span>{filteredImages.length} {t.background.transparent === '투명' ? '작품' : 'works'}</span>
            </div>
          </div>

          {filteredImages.length > 0 ? (
            <div className={styles.gallery}>
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className={styles.card}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div 
                    className={styles.imageWrapper}
                    onContextMenu={handleContextMenu}
                  >
                    <img
                      src={image.thumbnailUrl}
                      alt={image.title}
                      className={styles.thumbnail}
                      onClick={() => handleImageClick(image)}
                      onDragStart={handleDragStart}
                    />
                    {/* 투명 오버레이로 우클릭 저장 방지 */}
                    <div 
                      className={styles.protectedOverlay}
                      onClick={() => handleImageClick(image)}
                      onContextMenu={handleContextMenu}
                    />
                  </div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.cardTitle}>{image.title}</h3>
                    <p className={styles.cardAuthor}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      {image.authorName}
                    </p>
                  </div>
                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {image.likes}
                    </div>
                    {isPro ? (
                      <button
                        className={styles.downloadButton}
                        onClick={() => handleDownload(image)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        {t.results.download}
                      </button>
                    ) : (
                      <span className={styles.proOnlyBadge}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                        Pro
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <h3 className={styles.emptyTitle}>
                {t.background.transparent === '투명' ? '아직 공유된 작품이 없어요' : 'No works shared yet'}
              </h3>
              <p className={styles.emptyDescription}>
                {t.background.transparent === '투명'
                  ? 'Pro 사용자들이 첫 작품을 공유하면 여기에 표시됩니다.'
                  : 'Works will appear here when Pro users share their creations.'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedImage && (
        <HubImageModal
          image={selectedImage}
          isPro={isPro}
          onClose={() => setSelectedImage(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
