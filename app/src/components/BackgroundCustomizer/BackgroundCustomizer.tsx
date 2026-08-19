import { useState, useRef, useCallback } from 'react';
import type { BackgroundOption, BackgroundType } from '../../types';
import styles from './BackgroundCustomizer.module.css';

interface BackgroundCustomizerProps {
  option: BackgroundOption;
  onChange: (option: BackgroundOption) => void;
  disabled?: boolean;
}

const PRESET_COLORS = [
  '#FFFFFF', '#000000', '#F3F4F6', '#EF4444', 
  '#F97316', '#EAB308', '#22C55E', '#3B82F6',
  '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1',
];

export default function BackgroundCustomizer({ option, onChange, disabled }: BackgroundCustomizerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTypeChange = useCallback((type: BackgroundType) => {
    if (disabled) return;
    
    if (type === 'transparent') {
      onChange({ type: 'transparent' });
    } else if (type === 'color') {
      onChange({ type: 'color', color: option.color || '#FFFFFF' });
    } else {
      onChange({ type: 'image', imageUrl: option.imageUrl });
    }
  }, [disabled, onChange, option]);

  const handleColorChange = useCallback((color: string) => {
    if (disabled) return;
    onChange({ type: 'color', color });
  }, [disabled, onChange]);

  const handleImageSelect = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onChange({ type: 'image', imageUrl });
    };
    reader.readAsDataURL(file);
    
    e.target.value = '';
  }, [onChange]);

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      <button 
        className={styles.header}
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
      >
        <div className={styles.headerLeft}>
          <span className={styles.proBadge}>Pro</span>
          <span className={styles.title}>배경 커스텀</span>
        </div>
        <svg 
          className={`${styles.chevron} ${isExpanded ? styles.chevronUp : ''}`}
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div className={`${styles.content} ${isExpanded ? styles.contentExpanded : ''}`}>
        <div className={styles.typeSelector}>
          <button
            className={`${styles.typeButton} ${option.type === 'transparent' ? styles.typeButtonActive : ''}`}
            onClick={() => handleTypeChange('transparent')}
          >
            <div className={styles.typePreview}>
              <div className={styles.checkerboard} />
            </div>
            <span>투명</span>
          </button>

          <button
            className={`${styles.typeButton} ${option.type === 'color' ? styles.typeButtonActive : ''}`}
            onClick={() => handleTypeChange('color')}
          >
            <div className={styles.typePreview}>
              <div 
                className={styles.colorPreview} 
                style={{ background: option.color || '#FFFFFF' }}
              />
            </div>
            <span>색상</span>
          </button>

          <button
            className={`${styles.typeButton} ${option.type === 'image' ? styles.typeButtonActive : ''}`}
            onClick={() => handleTypeChange('image')}
          >
            <div className={styles.typePreview}>
              {option.imageUrl ? (
                <img src={option.imageUrl} alt="배경" className={styles.imagePreview} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>
            <span>이미지</span>
          </button>
        </div>

        {option.type === 'color' && (
          <div className={styles.colorPicker}>
            <div className={styles.colorGrid}>
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorSwatch} ${option.color === color ? styles.colorSwatchActive : ''}`}
                  style={{ background: color }}
                  onClick={() => handleColorChange(color)}
                  aria-label={`색상 ${color}`}
                />
              ))}
            </div>
            <div className={styles.customColor}>
              <label htmlFor="customColor" className={styles.customColorLabel}>
                직접 입력
              </label>
              <input
                id="customColor"
                type="color"
                value={option.color || '#FFFFFF'}
                onChange={(e) => handleColorChange(e.target.value)}
                className={styles.colorInput}
              />
              <input
                type="text"
                value={option.color || '#FFFFFF'}
                onChange={(e) => handleColorChange(e.target.value)}
                className={styles.hexInput}
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        )}

        {option.type === 'image' && (
          <div className={styles.imagePicker}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />
            <button className={styles.imageSelectButton} onClick={handleImageSelect}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              배경 이미지 선택
            </button>
            {option.imageUrl && (
              <p className={styles.imageHint}>이미지가 선택되었습니다</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
