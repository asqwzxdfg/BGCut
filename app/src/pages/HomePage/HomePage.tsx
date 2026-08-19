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
import { useLanguage } from '../../contexts/LanguageContext';
import { downloadSingleFile, downloadAllAsZip } from '../../utils/download';
import type { ProcessingResult, BackgroundOption } from '../../types';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    if (!user) {
      if (window.confirm(t.dropzone.loginRequired)) {
        navigate('/login');
      }
      return;
    }

    if (!canUseService()) {
      if (window.confirm(t.dropzone.limitReached)) {
        navigate('/pricing');
      }
      return;
    }

    incrementUsage();
    addFiles(selectedFiles);
  }, [user, canUseService, incrementUsage, addFiles, navigate, t]);

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
            {user && !isPro && showUpload && (
              <div className={styles.usageInfo}>
                <span>{t.usage.remaining} </span>
                <strong>
                  {remainingUsage === Infinity 
                    ? t.usage.unlimited 
                    : `${remainingUsage}${t.usage.times}`}
                </strong>
                {remainingUsage === 0 && (
                  <button 
                    className={styles.upgradeLink}
                    onClick={() => navigate('/pricing')}
                  >
                    {t.usage.upgrade}
                  </button>
                )}
              </div>
            )}

            <div className={`${styles.dropZoneWrapper} ${showUpload ? styles.dropZoneVisible : ''}`}>
              <DropZone
                onFilesSelected={handleFilesSelected}
                disabled={isProcessing && files.length >= 20}
              />

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
