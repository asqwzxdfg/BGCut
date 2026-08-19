import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import DropZone from '../../components/DropZone';
import ProcessingQueue from '../../components/ProcessingQueue';
import ResultSection from '../../components/ResultSection';
import ComparisonSlider from '../../components/ComparisonSlider';
import HubUploadModal from '../../components/HubUploadModal';
import Footer from '../../components/Footer';
import { useBackgroundRemoval } from '../../hooks/useBackgroundRemoval';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { downloadSingleFile, downloadAllAsZip } from '../../utils/download';
import type { ProcessingResult } from '../../types';
import styles from './EditorPage.module.css';
import { useState } from 'react';

export default function EditorPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [compareResult, setCompareResult] = useState<ProcessingResult | null>(null);
  const [hubUploadResult, setHubUploadResult] = useState<ProcessingResult | null>(null);

  const { user, canUseService, incrementUsage, getRemainingUsage } = useAuth();
  const isKorean = t.background.transparent === '투명';

  const {
    files,
    results,
    isProcessing,
    currentMode,
    setCurrentMode,
    addFiles,
    retryFile,
    retryWithMode,
    removeResult,
    updateResultBackground,
  } = useBackgroundRemoval();

  const scrollToTop = useCallback(() => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

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
    const bgOption = result.backgroundOption || { type: 'transparent' as const };
    downloadSingleFile(result, bgOption);
  }, []);

  const handleDownloadAll = useCallback(() => {
    downloadAllAsZip(results, { type: 'transparent' });
  }, [results]);

  const handleCompare = useCallback((result: ProcessingResult) => {
    setCompareResult(result);
  }, []);

  const handleCloseCompare = useCallback(() => {
    setCompareResult(null);
  }, []);

  const handleHubUpload = useCallback((result: ProcessingResult) => {
    setHubUploadResult(result);
  }, []);

  const handleHubUploadSuccess = useCallback(() => {
    alert(isKorean ? '허브에 성공적으로 공유되었습니다!' : 'Successfully shared to Hub!');
  }, [isKorean]);

  const queueFiles = files.filter((f) => f.status !== 'complete');
  const isPro = user?.plan === 'pro';
  const remainingUsage = getRemainingUsage();

  return (
    <div className={styles.page}>
      <Header onScrollToTop={scrollToTop} />

      <main className={styles.main}>
        <section className={styles.editorSection}>
          <div className={styles.container}>
            {user && !isPro && (
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

            <div className={styles.dropZoneWrapper}>
              <DropZone
                onFilesSelected={handleFilesSelected}
                disabled={isProcessing && files.length >= 20}
                currentMode={currentMode}
                onModeChange={setCurrentMode}
              />
            </div>

            <ProcessingQueue files={queueFiles} onRetry={retryFile} />

            <ResultSection
              results={results}
              onAddMore={handleFilesSelected}
              onDownload={handleDownload}
              onDownloadAll={handleDownloadAll}
              onDelete={removeResult}
              onCompare={handleCompare}
              onHubUpload={handleHubUpload}
              onUpdateBackground={updateResultBackground}
              onRetryWithMode={retryWithMode}
            />
          </div>
        </section>
      </main>

      <Footer />

      <ComparisonSlider result={compareResult} onClose={handleCloseCompare} />

      {hubUploadResult && (
        <HubUploadModal
          result={hubUploadResult}
          onClose={() => setHubUploadResult(null)}
          onSuccess={handleHubUploadSuccess}
        />
      )}
    </div>
  );
}
