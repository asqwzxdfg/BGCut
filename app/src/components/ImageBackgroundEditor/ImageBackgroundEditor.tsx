import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { BackgroundOption } from '../../types';
import styles from './ImageBackgroundEditor.module.css';

interface ImageBackgroundEditorProps {
  backgroundOption: BackgroundOption;
  foregroundUrl: string;
  onApply: (option: BackgroundOption) => void;
  onClose: () => void;
}

const POSITION_PRESETS = [
  { x: 0, y: 0, label: '↖' },
  { x: 50, y: 0, label: '↑' },
  { x: 100, y: 0, label: '↗' },
  { x: 0, y: 50, label: '←' },
  { x: 50, y: 50, label: '●' },
  { x: 100, y: 50, label: '→' },
  { x: 0, y: 100, label: '↙' },
  { x: 50, y: 100, label: '↓' },
  { x: 100, y: 100, label: '↘' },
];

export default function ImageBackgroundEditor({
  backgroundOption,
  foregroundUrl,
  onApply,
  onClose,
}: ImageBackgroundEditorProps) {
  const { t } = useLanguage();

  const defaultSettings = useMemo(() => ({
    x: 50,
    y: 50,
    scale: 1,
    opacity: 1,
  }), []);

  const [settings, setSettings] = useState(
    backgroundOption.imageSettings || defaultSettings
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleApply = useCallback(() => {
    onApply({
      ...backgroundOption,
      imageSettings: settings,
    });
    onClose();
  }, [backgroundOption, settings, onApply, onClose]);

  const handleReset = useCallback(() => {
    setSettings(defaultSettings);
  }, [defaultSettings]);

  const handlePositionPreset = useCallback((x: number, y: number) => {
    setSettings(prev => ({ ...prev, x, y }));
  }, []);

  const backgroundStyle = useMemo(() => {
    if (backgroundOption.type === 'color') {
      return { backgroundColor: backgroundOption.color };
    }
    if (backgroundOption.type === 'image' && backgroundOption.imageUrl) {
      return {
        backgroundImage: `url(${backgroundOption.imageUrl})`,
        backgroundSize: `${settings.scale * 100}%`,
        backgroundPosition: `${settings.x}% ${settings.y}%`,
        opacity: settings.opacity,
      };
    }
    return {};
  }, [backgroundOption, settings]);

  const isImage = backgroundOption.type === 'image';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.proBadge}>Pro</span>
            {t.background.title}
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.previewArea}>
            <div className={styles.previewContainer}>
              <div className={styles.checkerboard} />
              <div className={styles.backgroundLayer} style={backgroundStyle} />
              <div className={styles.foregroundLayer}>
                <img src={foregroundUrl} alt="Preview" />
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            {isImage && (
              <>
                <div className={styles.controlGroup}>
                  <div className={styles.controlLabel}>
                    <span>{t.background.transparent === '투명' ? '확대/축소' : 'Scale'}</span>
                    <span className={styles.controlValue}>{Math.round(settings.scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={settings.scale * 100}
                    onChange={(e) => setSettings(prev => ({ ...prev, scale: Number(e.target.value) / 100 }))}
                    className={styles.slider}
                  />
                </div>

                <div className={styles.controlGroup}>
                  <div className={styles.controlLabel}>
                    <span>{t.background.transparent === '투명' ? '투명도' : 'Opacity'}</span>
                    <span className={styles.controlValue}>{Math.round(settings.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={settings.opacity * 100}
                    onChange={(e) => setSettings(prev => ({ ...prev, opacity: Number(e.target.value) / 100 }))}
                    className={styles.slider}
                  />
                </div>

                <div className={styles.controlGroup}>
                  <div className={styles.controlLabel}>
                    <span>{t.background.transparent === '투명' ? '위치' : 'Position'}</span>
                  </div>
                  <div className={styles.positionGrid}>
                    {POSITION_PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        className={`${styles.positionButton} ${
                          settings.x === preset.x && settings.y === preset.y ? styles.positionButtonActive : ''
                        }`}
                        onClick={() => handlePositionPreset(preset.x, preset.y)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.controlGroup}>
                  <div className={styles.controlLabel}>
                    <span>X {t.background.transparent === '투명' ? '위치' : 'Position'}</span>
                    <span className={styles.controlValue}>{settings.x}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.x}
                    onChange={(e) => setSettings(prev => ({ ...prev, x: Number(e.target.value) }))}
                    className={styles.slider}
                  />
                </div>

                <div className={styles.controlGroup}>
                  <div className={styles.controlLabel}>
                    <span>Y {t.background.transparent === '투명' ? '위치' : 'Position'}</span>
                    <span className={styles.controlValue}>{settings.y}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.y}
                    onChange={(e) => setSettings(prev => ({ ...prev, y: Number(e.target.value) }))}
                    className={styles.slider}
                  />
                </div>

                <div className={styles.quickActions}>
                  <button className={styles.quickButton} onClick={handleReset}>
                    {t.background.transparent === '투명' ? '초기화' : 'Reset'}
                  </button>
                </div>
              </>
            )}

            {!isImage && (
              <div className={styles.controlGroup}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
                  {t.background.transparent === '투명' 
                    ? '이미지 배경을 선택하면 위치, 확대/축소, 투명도를 조정할 수 있습니다.' 
                    : 'Select an image background to adjust position, scale, and opacity.'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            {t.background.transparent === '투명' ? '취소' : 'Cancel'}
          </button>
          <button className={styles.applyButton} onClick={handleApply}>
            {t.background.transparent === '투명' ? '적용' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
}
