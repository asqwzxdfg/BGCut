import { useRef, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { ProcessingResult, BackgroundOption } from '../../types';
import styles from './ResultSection.module.css';

interface ResultSectionProps {
  results: ProcessingResult[];
  onAddMore: (files: File[]) => void;
  onDownload: (result: ProcessingResult) => void;
  onDownloadAll: () => void;
  onDelete: (id: string) => void;
  onCompare: (result: ProcessingResult) => void;
  backgroundOption?: BackgroundOption;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function ResultSection({
  results,
  onAddMore,
  onDownload,
  onDownloadAll,
  onDelete,
  onCompare,
  backgroundOption = { type: 'transparent' },
}: ResultSectionProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const backgroundStyle = useMemo(() => {
    if (backgroundOption.type === 'color' && backgroundOption.color) {
      return { backgroundColor: backgroundOption.color };
    }
    if (backgroundOption.type === 'image' && backgroundOption.imageUrl) {
      return { 
        backgroundImage: `url(${backgroundOption.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {};
  }, [backgroundOption]);

  const isTransparent = backgroundOption.type === 'transparent';

  if (results.length === 0) return null;

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddMore(Array.from(files));
    }
    e.target.value = '';
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>{t.results.title}</h2>
          <span className={styles.count}>{results.length}</span>
        </div>

        <div className={styles.actions}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            multiple
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
          <button className={styles.addButton} onClick={handleAddClick}>
            {t.results.addMore}
          </button>
          {results.length >= 2 && (
            <button className={styles.downloadAllButton} onClick={onDownloadAll}>
              {t.results.downloadAll}
            </button>
          )}
        </div>
      </div>

      <div className={styles.results}>
        {results.map((result, index) => (
          <div
            key={result.id}
            className={styles.card}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className={styles.preview}>
              <div 
                className={`${styles.previewBg} ${isTransparent ? styles.checkerboard : ''}`}
                style={!isTransparent ? backgroundStyle : {}}
              >
                <img src={result.resultUrl} alt={result.originalName} />
              </div>
            </div>

            <div className={styles.info}>
              <p className={styles.filename}>
                {result.originalName.replace(/\.[^/.]+$/, '')}_bgremoved.png
              </p>
              <p className={styles.filesize}>{formatFileSize(result.size)}</p>
            </div>

            <div className={styles.cardActions}>
              <button
                className={styles.compareButton}
                onClick={() => onCompare(result)}
              >
                {t.results.viewOriginal}
              </button>
              <button
                className={styles.downloadButton}
                onClick={() => onDownload(result)}
              >
                {t.results.download}
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => onDelete(result.id)}
                aria-label="Delete"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
