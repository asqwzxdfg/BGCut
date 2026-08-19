import { useState, useEffect, useCallback } from 'react';
import { useHub } from '../../contexts/HubContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { ProcessingResult } from '../../types';
import styles from './HubUploadModal.module.css';

interface HubUploadModalProps {
  result: ProcessingResult;
  onClose: () => void;
  onSuccess: () => void;
}

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

export default function HubUploadModal({ result, onClose, onSuccess }: HubUploadModalProps) {
  const { uploadImage, isLoading } = useHub();
  const { user } = useAuth();
  const { t } = useLanguage();
  const isKorean = t.background.transparent === '투명';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !title.trim()) return;

    const success = await uploadImage(
      {
        title: title.trim(),
        description: description.trim(),
        imageBlob: result.resultBlob,
      },
      user.id,
      user.name
    );

    if (success) {
      onSuccess();
      onClose();
    }
  }, [user, title, description, result, uploadImage, onSuccess, onClose]);

  const isValid = title.trim().length > 0 && title.length <= MAX_TITLE_LENGTH;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.proBadge}>Pro</span>
            {isKorean ? '허브에 공유하기' : 'Share to Hub'}
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.preview}>
            <img
              src={result.resultUrl}
              alt="Preview"
              className={styles.previewImage}
            />
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>
                {isKorean ? '제목' : 'Title'} <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder={isKorean ? '작품 제목을 입력하세요' : 'Enter a title for your work'}
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
                required
                autoFocus
              />
              <span className={styles.charCount}>
                {title.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                {isKorean ? '설명' : 'Description'}
              </label>
              <textarea
                className={styles.textarea}
                placeholder={isKorean ? '작품에 대한 설명을 입력하세요 (선택)' : 'Describe your work (optional)'}
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
              />
              <span className={styles.charCount}>
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
          </form>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            {isKorean ? '취소' : 'Cancel'}
          </button>
          <button
            className={styles.uploadButton}
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                {isKorean ? '업로드 중...' : 'Uploading...'}
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {isKorean ? '허브에 공유' : 'Share to Hub'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
