import { useLanguage } from '../../contexts/LanguageContext';
import type { ImageFile } from '../../types';
import styles from './ProcessingQueue.module.css';

interface ProcessingQueueProps {
  files: ImageFile[];
  onRetry: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function ProcessingQueue({ files, onRetry }: ProcessingQueueProps) {
  const { t } = useLanguage();

  if (files.length === 0) return null;

  return (
    <div className={styles.queue}>
      {files.map((file, index) => (
        <div
          key={file.id}
          className={`${styles.card} ${styles[file.status]}`}
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <div className={styles.thumbnail}>
            <img src={file.preview} alt={file.name} />
          </div>

          <div className={styles.info}>
            <p className={styles.filename}>{file.name}</p>
            <p className={styles.filesize}>{formatFileSize(file.size)}</p>
          </div>

          <div className={styles.progressWrapper}>
            <div className={styles.progressTrack}>
              <div
                className={`${styles.progressFill} ${styles[`progress${file.status.charAt(0).toUpperCase() + file.status.slice(1)}`]}`}
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>

          <div className={styles.status}>
            {file.status === 'waiting' && (
              <span className={styles.statusWaiting}>{t.processing.waiting}</span>
            )}
            {file.status === 'processing' && (
              <span className={styles.statusProcessing}>
                <span className={styles.spinner} />
                {t.processing.processing}
              </span>
            )}
            {file.status === 'complete' && (
              <span className={styles.statusComplete}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t.processing.complete}
              </span>
            )}
            {file.status === 'error' && (
              <button
                className={styles.retryButton}
                onClick={() => onRetry(file.id)}
                aria-label={t.processing.retry}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                {t.processing.retry}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
