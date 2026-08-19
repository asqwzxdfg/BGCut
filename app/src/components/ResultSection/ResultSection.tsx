import { useRef, useState, useMemo, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import type { ProcessingResult, BackgroundOption, BackgroundType, RemovalMode } from '../../types';
import styles from './ResultSection.module.css';

interface ResultSectionProps {
  results: ProcessingResult[];
  onAddMore: (files: File[]) => void;
  onDownload: (result: ProcessingResult) => void;
  onDownloadAll: () => void;
  onDelete: (id: string) => void;
  onCompare: (result: ProcessingResult) => void;
  onHubUpload?: (result: ProcessingResult) => void;
  onUpdateBackground: (id: string, option: BackgroundOption) => void;
  onRetryWithMode?: (id: string, mode: RemovalMode) => void;
}

const PRESET_COLORS = [
  '#FFFFFF', '#000000', '#F3F4F6', '#EF4444', 
  '#F97316', '#EAB308', '#22C55E', '#3B82F6',
  '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1',
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function ResultCard({
  result,
  isPro,
  isKorean,
  t,
  onCompare,
  onDownload,
  onHubUpload,
  onDelete,
  onUpdateBackground,
  onRetryWithMode,
}: {
  result: ProcessingResult;
  isPro: boolean;
  isKorean: boolean;
  t: ReturnType<typeof useLanguage>['t'];
  onCompare: (result: ProcessingResult) => void;
  onDownload: (result: ProcessingResult) => void;
  onHubUpload?: (result: ProcessingResult) => void;
  onDelete: (id: string) => void;
  onUpdateBackground: (id: string, option: BackgroundOption) => void;
  onRetryWithMode?: (id: string, mode: RemovalMode) => void;
}) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showRetryMenu, setShowRetryMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const bgOption = result.backgroundOption || { type: 'transparent' as BackgroundType };
  const usedMode = result.usedMode || 'ai';

  // 모든 모드 옵션 (항상 두 가지 모두 표시)
  const retryModes: Array<{ mode: RemovalMode; label: string }> = [
    { mode: 'ai', label: isKorean ? '인물/사물 모드로 재시도' : 'Retry with Photo mode' },
    { mode: 'logo', label: isKorean ? '로고/아이콘 모드로 재시도' : 'Retry with Logo mode' },
  ];

  const modeLabel = usedMode === 'ai' 
    ? (isKorean ? 'AI' : 'AI')
    : (isKorean ? '로고' : 'Logo');

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

  const handleTypeChange = useCallback((type: BackgroundType) => {
    if (type === 'transparent') {
      onUpdateBackground(result.id, { type: 'transparent' });
    } else if (type === 'color') {
      onUpdateBackground(result.id, { type: 'color', color: bgOption.color || '#FFFFFF' });
    } else {
      onUpdateBackground(result.id, { type: 'image', imageUrl: bgOption.imageUrl });
    }
  }, [result.id, bgOption, onUpdateBackground]);

  const handleColorChange = useCallback((color: string) => {
    onUpdateBackground(result.id, { type: 'color', color });
  }, [result.id, onUpdateBackground]);

  const handleImageSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onUpdateBackground(result.id, { 
        type: 'image', 
        imageUrl,
        imageSettings: { x: 50, y: 50, scale: 1, opacity: 1 },
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [result.id, onUpdateBackground]);

  return (
    <div className={styles.card}>
      <div className={styles.cardMain}>
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
          <div className={styles.metaRow}>
            <span className={styles.filesize}>{formatFileSize(result.size)}</span>
            <span className={styles.modeBadge} data-mode={usedMode}>
              {modeLabel}
            </span>
          </div>
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
          {/* 다른 모드로 재시도 */}
          {onRetryWithMode && result.originalFile && (
            <div className={styles.retryWrapper}>
              <button
                className={styles.retryButton}
                onClick={() => setShowRetryMenu(!showRetryMenu)}
                title={isKorean ? '다른 모드로 재시도' : 'Retry with different mode'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </button>
              {showRetryMenu && (
                <div className={styles.retryMenu}>
                  <p className={styles.retryMenuTitle}>
                    {isKorean ? '결과가 마음에 안 드시나요?' : 'Not satisfied with the result?'}
                  </p>
                  {retryModes.map(({ mode, label }) => (
                    <button
                      key={mode}
                      className={`${styles.retryMenuItem} ${mode === usedMode ? styles.retryMenuItemCurrent : ''}`}
                      onClick={() => {
                        onRetryWithMode(result.id, mode);
                        setShowRetryMenu(false);
                      }}
                    >
                      {label}
                      {mode === usedMode && (
                        <span className={styles.currentBadge}>
                          {isKorean ? '현재' : 'Current'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {isPro && (
            <button
              className={`${styles.editButton} ${isEditorOpen ? styles.editButtonActive : ''}`}
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              title={isKorean ? '배경 커스텀' : 'Customize Background'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
          {isPro && onHubUpload && (
            <button
              className={styles.hubButton}
              onClick={() => onHubUpload(result)}
              title={isKorean ? '허브에 공유' : 'Share to Hub'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </button>
          )}
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(result.id)}
            aria-label="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* 배경 커스텀 에디터 (Pro 전용) */}
      {isPro && isEditorOpen && (
        <div className={styles.bgEditor}>
          <div className={styles.bgEditorHeader}>
            <span className={styles.bgEditorTitle}>
              <span className={styles.proBadge}>Pro</span>
              {isKorean ? '배경 커스텀' : 'Background Custom'}
            </span>
          </div>

          <div className={styles.typeSelector}>
            <button
              className={`${styles.typeButton} ${bgOption.type === 'transparent' ? styles.typeButtonActive : ''}`}
              onClick={() => handleTypeChange('transparent')}
            >
              <div className={styles.typePreview}>
                <div className={styles.miniCheckerboard} />
              </div>
              <span>{isKorean ? '투명' : 'Clear'}</span>
            </button>

            <button
              className={`${styles.typeButton} ${bgOption.type === 'color' ? styles.typeButtonActive : ''}`}
              onClick={() => handleTypeChange('color')}
            >
              <div className={styles.typePreview}>
                <div 
                  className={styles.colorPreview} 
                  style={{ background: bgOption.color || '#FFFFFF' }}
                />
              </div>
              <span>{isKorean ? '색상' : 'Color'}</span>
            </button>

            <button
              className={`${styles.typeButton} ${bgOption.type === 'image' ? styles.typeButtonActive : ''}`}
              onClick={() => handleTypeChange('image')}
            >
              <div className={styles.typePreview}>
                {bgOption.imageUrl ? (
                  <img src={bgOption.imageUrl} alt="Background" className={styles.imgPreview} />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>
              <span>{isKorean ? '이미지' : 'Image'}</span>
            </button>
          </div>

          {bgOption.type === 'color' && (
            <div className={styles.colorPicker}>
              <div className={styles.colorGrid}>
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`${styles.colorSwatch} ${bgOption.color === color ? styles.colorSwatchActive : ''}`}
                    style={{ background: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
              <div className={styles.customColor}>
                <input
                  type="color"
                  value={bgOption.color || '#FFFFFF'}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className={styles.colorInput}
                />
                <input
                  type="text"
                  value={bgOption.color || '#FFFFFF'}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className={styles.hexInput}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          )}

          {bgOption.type === 'image' && (
            <div className={styles.imagePicker}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.hiddenInput}
              />
              <button className={styles.imageSelectButton} onClick={handleImageSelect}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {isKorean ? '배경 이미지 선택' : 'Select Background'}
              </button>
              {bgOption.imageUrl && (
                <p className={styles.imageHint}>{isKorean ? '이미지 선택됨' : 'Image selected'}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultSection({
  results,
  onAddMore,
  onDownload,
  onDownloadAll,
  onDelete,
  onCompare,
  onHubUpload,
  onUpdateBackground,
  onRetryWithMode,
}: ResultSectionProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isKorean = t.background.transparent === '투명';
  const isPro = user?.plan === 'pro';

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
          <div key={result.id} style={{ animationDelay: `${index * 0.08}s` }}>
            <ResultCard
              result={result}
              isPro={isPro}
              isKorean={isKorean}
              t={t}
              onCompare={onCompare}
              onDownload={onDownload}
              onHubUpload={onHubUpload}
              onDelete={onDelete}
              onUpdateBackground={onUpdateBackground}
              onRetryWithMode={onRetryWithMode}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
