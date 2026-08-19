import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import DropZone from '../../components/DropZone';
import ProcessingQueue from '../../components/ProcessingQueue';
import ResultSection from '../../components/ResultSection';
import ComparisonSlider from '../../components/ComparisonSlider';
import BackgroundCustomizer from '../../components/BackgroundCustomizer';
import Footer from '../../components/Footer';
import { useBackgroundRemoval } from '../../hooks/useBackgroundRemoval';
import { useAuth } from '../../contexts/AuthContext';
import { downloadSingleFile, downloadAllAsZip } from '../../utils/download';
import type { ProcessingResult, BackgroundOption } from '../../types';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const uploadRef = useRef<HTMLDivElement>(null);
  const [compareResult, setCompareResult] = useState<ProcessingResult | null>(null);
  const [showVisual, setShowVisual] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [backgroundOption, setBackgroundOption] = useState<BackgroundOption>({ type: 'transparent' });

  const { user, canUseService, incrementUsage, getRemainingUsage } = useAuth();

  const {
    files,
    results,
    isProcessing,
    addFiles,
    retryFile,
    removeResult,
  } = useBackgroundRemoval();

  const scrollToTop = useCallback(() => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const scrollToUpload = useCallback(() => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleStartClick = useCallback(() => {
    setShowVisual(false);
    setTimeout(() => {
      setShowUpload(true);
    }, 300);
  }, []);

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    // 로그인 체크
    if (!user) {
      if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        navigate('/login');
      }
      return;
    }

    // 사용량 체크
    if (!canUseService()) {
      if (window.confirm('오늘 무료 사용량을 모두 소진했습니다. Pro 플랜으로 업그레이드 하시겠습니까?')) {
        navigate('/pricing');
      }
      return;
    }

    // 사용량 증가 및 파일 처리
    incrementUsage();
    addFiles(selectedFiles);
  }, [user, canUseService, incrementUsage, addFiles, navigate]);

  const handleDownload = useCallback((result: ProcessingResult) => {
    downloadSingleFile(result, backgroundOption);
  }, [backgroundOption]);

  const handleDownloadAll = useCallback(() => {
    downloadAllAsZip(results, backgroundOption);
  }, [results, backgroundOption]);

  const handleCompare = useCallback((result: ProcessingResult) => {
    setCompareResult(result);
  }, []);

  const handleCloseCompare = useCallback(() => {
    setCompareResult(null);
  }, []);

  const queueFiles = files.filter((f) => f.status !== 'complete');
  const isPro = user?.plan === 'pro';
  const remainingUsage = getRemainingUsage();

  return (
    <div className={styles.page}>
      <Header onScrollToTop={scrollToTop} />

      <main className={styles.main}>
        <Hero 
          onScrollToUpload={scrollToUpload} 
          showVisual={showVisual}
          onStartClick={handleStartClick}
        />

        <section className={styles.uploadSection} ref={uploadRef}>
          <div className={styles.container}>
            {/* 사용량 표시 */}
            {user && !isPro && showUpload && (
              <div className={styles.usageInfo}>
                <span>오늘 남은 횟수: </span>
                <strong>{remainingUsage === Infinity ? '무제한' : `${remainingUsage}회`}</strong>
                {remainingUsage === 0 && (
                  <button 
                    className={styles.upgradeLink}
                    onClick={() => navigate('/pricing')}
                  >
                    Pro로 업그레이드
                  </button>
                )}
              </div>
            )}

            <div className={`${styles.dropZoneWrapper} ${showUpload ? styles.dropZoneVisible : ''}`}>
              <DropZone
                onFilesSelected={handleFilesSelected}
                disabled={isProcessing && files.length >= 20}
              />

              {/* Pro 사용자만 배경 커스터마이저 표시 */}
              {isPro && showUpload && (
                <BackgroundCustomizer
                  option={backgroundOption}
                  onChange={setBackgroundOption}
                  disabled={!isPro}
                />
              )}
            </div>

            <ProcessingQueue files={queueFiles} onRetry={retryFile} />

            <ResultSection
              results={results}
              onAddMore={handleFilesSelected}
              onDownload={handleDownload}
              onDownloadAll={handleDownloadAll}
              onDelete={removeResult}
              onCompare={handleCompare}
              backgroundOption={backgroundOption}
            />
          </div>
        </section>
      </main>

      <Footer />

      <ComparisonSlider result={compareResult} onClose={handleCloseCompare} />
    </div>
  );
}
