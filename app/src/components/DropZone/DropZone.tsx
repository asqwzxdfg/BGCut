import { useCallback, useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { RemovalMode } from '../../types';
import styles from './DropZone.module.css';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  currentMode: RemovalMode;
  onModeChange: (mode: RemovalMode) => void;
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 20;

export default function DropZone({ onFilesSelected, disabled, currentMode, onModeChange }: DropZoneProps) {
  const { t } = useLanguage();
  const isKorean = t.background.transparent === '투명';
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];

    if (files.length > MAX_FILES) {
      errors.push(t.errors.tooManyFiles.replace('{max}', String(MAX_FILES)));
      return { valid, errors };
    }

    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        errors.push(t.errors.invalidFileType.replace('{filename}', file.name));
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(t.errors.fileTooLarge.replace('{filename}', file.name));
        continue;
      }
      valid.push(file);
    }

    return { valid, errors };
  }, [t]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const { valid, errors } = validateFiles(fileArray);

    if (errors.length > 0) {
      setError(errors[0]);
      setTimeout(() => setError(null), 5000);
    } else {
      setError(null);
    }

    if (valid.length > 0) {
      onFilesSelected(valid);
    }
  }, [onFilesSelected, validateFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const { files } = e.dataTransfer;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    e.target.value = '';
  }, [handleFiles]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.dropzone} ${isDragOver ? styles.dragover : ''} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={t.dropzone.dragText}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple
          onChange={handleInputChange}
          className={styles.input}
          aria-hidden="true"
        />

        <div className={styles.icon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <p className={styles.mainText}>
          {isDragOver ? t.dropzone.dropText : t.dropzone.dragText}
        </p>

        <button 
          type="button" 
          className={styles.selectButton}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          disabled={disabled}
        >
          {t.dropzone.selectButton}
        </button>

        <p className={styles.subText}>
          {t.dropzone.fileTypes}
        </p>
      </div>

      {/* 모드 선택 UI */}
      <div className={styles.modeSelector}>
        <span className={styles.modeLabel}>
          {isKorean ? '처리 모드' : 'Mode'}
        </span>
        <div className={styles.modeButtons}>
          <button
            type="button"
            className={`${styles.modeButton} ${currentMode === 'auto' ? styles.modeActive : ''}`}
            onClick={() => onModeChange('auto')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            {isKorean ? '자동' : 'Auto'}
          </button>
          <button
            type="button"
            className={`${styles.modeButton} ${currentMode === 'ai' ? styles.modeActive : ''}`}
            onClick={() => onModeChange('ai')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {isKorean ? '인물/사물' : 'Photo'}
          </button>
          <button
            type="button"
            className={`${styles.modeButton} ${currentMode === 'logo' ? styles.modeActive : ''}`}
            onClick={() => onModeChange('logo')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {isKorean ? '로고/아이콘' : 'Logo'}
          </button>
        </div>
        <p className={styles.modeHint}>
          {currentMode === 'auto' && (isKorean ? '이미지를 분석하여 최적의 방식을 자동 선택합니다' : 'Automatically selects the best method')}
          {currentMode === 'ai' && (isKorean ? 'AI가 인물, 동물, 사물을 인식하여 배경을 제거합니다' : 'AI removes background from photos')}
          {currentMode === 'logo' && (isKorean ? '단색 배경의 로고/아이콘에 최적화된 색상 기반 제거' : 'Color-based removal for logos with solid backgrounds')}
        </p>
      </div>

      {error && (
        <div className={styles.errorMessage} role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
