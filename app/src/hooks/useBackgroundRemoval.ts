import { useState, useCallback, useRef, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';
import type { Config } from '@imgly/background-removal';
import type { ImageFile, ProcessingResult, FileStatus, SerializedResult, BackgroundOption, RemovalMode } from '../types';
import { analyzeImage } from '../utils/imageAnalyzer';
import { removeBackgroundByFloodFill } from '../utils/colorKeyRemoval';

// 고품질 배경 제거 설정
const REMOVAL_CONFIG: Config = {
  debug: false,
  progress: undefined,
  model: 'isnet',
  output: {
    format: 'image/png',
    quality: 1.0,
  },
};

const SESSION_KEY = 'bgcut_session_results';
const MAX_RESULTS = 20;

let idCounter = 0;
const generateId = () => `file_${Date.now()}_${++idCounter}`;

// Base64 <-> Blob 변환 유틸리티
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
};

// 세션 저장
const saveToSession = async (results: ProcessingResult[]): Promise<void> => {
  try {
    const toSave = results.slice(-MAX_RESULTS);
    
    const serialized: SerializedResult[] = await Promise.all(
      toSave.map(async (r) => ({
        id: r.id,
        originalName: r.originalName,
        originalPreview: r.originalPreview,
        resultBase64: await blobToBase64(r.resultBlob),
        size: r.size,
        backgroundOption: r.backgroundOption,
        usedMode: r.usedMode,
      }))
    );
    
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(serialized));
  } catch (e) {
    console.warn('Failed to save session:', e);
  }
};

// 세션 복원
const loadFromSession = (): ProcessingResult[] => {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return [];
    
    const serialized: SerializedResult[] = JSON.parse(stored);
    
    return serialized.map((s) => {
      const blob = base64ToBlob(s.resultBase64);
      return {
        id: s.id,
        originalName: s.originalName,
        originalPreview: s.originalPreview,
        resultBlob: blob,
        resultUrl: URL.createObjectURL(blob),
        size: s.size,
        backgroundOption: s.backgroundOption,
        usedMode: s.usedMode,
      };
    });
  } catch (e) {
    console.warn('Failed to load session:', e);
    return [];
  }
};

const clearSession = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
};

export function useBackgroundRemoval() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [results, setResults] = useState<ProcessingResult[]>(() => loadFromSession());
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMode, setCurrentMode] = useState<RemovalMode>('auto');
  
  const processingRef = useRef(false);
  const filesRef = useRef<ImageFile[]>([]);
  const blobUrlsRef = useRef<Set<string>>(new Set());
  const modeRef = useRef<RemovalMode>('auto');

  // refs 동기화
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    modeRef.current = currentMode;
  }, [currentMode]);

  // 결과 변경 시 세션 저장
  useEffect(() => {
    const timer = setTimeout(() => {
      if (results.length > 0) {
        saveToSession(results);
      } else {
        // 결과가 없으면 세션 클리어
        clearSession();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [results]);

  // 컴포넌트 언마운트 시 Blob URL 정리
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      blobUrlsRef.current.clear();
    };
  }, []);

  const createTrackedBlobUrl = useCallback((blob: Blob): string => {
    const url = URL.createObjectURL(blob);
    blobUrlsRef.current.add(url);
    return url;
  }, []);

  const revokeTrackedBlobUrl = useCallback((url: string): void => {
    if (blobUrlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      blobUrlsRef.current.delete(url);
    }
  }, []);

  const createPreviewUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const updateFileStatus = useCallback((id: string, updates: Partial<ImageFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  /**
   * AI 모델로 배경 제거 (기존 방식)
   */
  const processWithAI = async (file: File): Promise<Blob> => {
    return await removeBackground(file, REMOVAL_CONFIG);
  };

  /**
   * 색상 기반 배경 제거 (로고/아이콘용)
   */
  const processWithColorKey = async (file: File): Promise<Blob> => {
    return await removeBackgroundByFloodFill(file, { tolerance: 35 });
  };

  /**
   * 자동 모드: 이미지 분석 후 적절한 방식 선택
   */
  const processAuto = async (file: File): Promise<{ blob: Blob; usedMode: RemovalMode }> => {
    try {
      const analysis = await analyzeImage(file);
      
      if (analysis.suggestedMode === 'color' && analysis.backgroundUniformity > 0.5) {
        // 로고/아이콘으로 판단 - 색상 기반 처리
        const blob = await processWithColorKey(file);
        return { blob, usedMode: 'logo' };
      } else {
        // 사진으로 판단 - AI 처리
        const blob = await processWithAI(file);
        return { blob, usedMode: 'ai' };
      }
    } catch {
      // 분석 실패 시 AI 모드로 폴백
      const blob = await processWithAI(file);
      return { blob, usedMode: 'ai' };
    }
  };

  const processFile = useCallback(async (
    imageFile: ImageFile,
    forceMode?: RemovalMode
  ): Promise<ProcessingResult | null> => {
    try {
      updateFileStatus(imageFile.id, { status: 'processing', progress: 10 });

      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === imageFile.id && f.status === 'processing' && f.progress < 90) {
              return { ...f, progress: f.progress + 5 };
            }
            return f;
          })
        );
      }, 300);

      const mode = forceMode || modeRef.current;
      let resultBlob: Blob;
      let usedMode: RemovalMode;

      switch (mode) {
        case 'ai':
          resultBlob = await processWithAI(imageFile.file);
          usedMode = 'ai';
          break;
        case 'logo':
          resultBlob = await processWithColorKey(imageFile.file);
          usedMode = 'logo';
          break;
        case 'auto':
        default:
          const result = await processAuto(imageFile.file);
          resultBlob = result.blob;
          usedMode = result.usedMode;
          break;
      }

      clearInterval(progressInterval);

      updateFileStatus(imageFile.id, { status: 'complete', progress: 100, usedMode });

      const resultUrl = createTrackedBlobUrl(resultBlob);

      return {
        id: imageFile.id,
        originalName: imageFile.name,
        originalPreview: imageFile.preview,
        resultBlob,
        resultUrl,
        size: resultBlob.size,
        backgroundOption: { type: 'transparent' },
        usedMode,
        originalFile: imageFile.file,
      };
    } catch (error) {
      console.error('Background removal failed:', error);
      updateFileStatus(imageFile.id, {
        status: 'error',
        progress: 0,
        error: '이미지 처리 중 오류가 발생했습니다.',
      });
      return null;
    }
  }, [updateFileStatus, createTrackedBlobUrl]);

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessing(true);

    let waitingFiles = filesRef.current.filter((f) => f.status === 'waiting');

    while (waitingFiles.length > 0) {
      const file = waitingFiles[0];
      
      const result = await processFile(file);
      if (result) {
        setResults((prev) => {
          const updated = [...prev, result];
          if (updated.length > MAX_RESULTS) {
            const removed = updated.shift();
            if (removed) {
              revokeTrackedBlobUrl(removed.resultUrl);
            }
          }
          return updated;
        });
      }

      waitingFiles = filesRef.current.filter((f) => f.status === 'waiting');
    }

    processingRef.current = false;
    setIsProcessing(false);
  }, [processFile, revokeTrackedBlobUrl]);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const imageFiles: ImageFile[] = await Promise.all(
      newFiles.map(async (file) => ({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        preview: await createPreviewUrl(file),
        status: 'waiting' as FileStatus,
        progress: 0,
      }))
    );

    setFiles((prev) => {
      const updated = [...prev, ...imageFiles];
      filesRef.current = updated;
      return updated;
    });

    if (!processingRef.current) {
      setTimeout(() => {
        processQueue();
      }, 50);
    }
  }, [processQueue]);

  /**
   * 다른 모드로 재처리
   */
  const retryWithMode = useCallback(async (id: string, mode: RemovalMode) => {
    const result = results.find((r) => r.id === id);
    if (!result || !result.originalFile) return;

    // 기존 결과 제거
    setResults((prev) => {
      const existing = prev.find((r) => r.id === id);
      if (existing) {
        revokeTrackedBlobUrl(existing.resultUrl);
      }
      return prev.filter((r) => r.id !== id);
    });

    // 새 파일로 다시 추가
    const newId = generateId();
    const imageFile: ImageFile = {
      id: newId,
      file: result.originalFile,
      name: result.originalName,
      size: result.originalFile.size,
      preview: result.originalPreview,
      status: 'waiting',
      progress: 0,
    };

    setFiles((prev) => {
      const updated = [...prev.filter((f) => f.id !== id), imageFile];
      filesRef.current = updated;
      return updated;
    });

    // 지정된 모드로 처리
    const newResult = await processFile(imageFile, mode);
    if (newResult) {
      setResults((prev) => [...prev, newResult]);
    }
  }, [results, processFile, revokeTrackedBlobUrl]);

  const retryFile = useCallback(async (id: string) => {
    const file = filesRef.current.find((f) => f.id === id);
    if (!file || file.status !== 'error') return;

    updateFileStatus(id, { status: 'waiting', progress: 0, error: undefined });

    if (!processingRef.current) {
      setTimeout(() => {
        processQueue();
      }, 50);
    }
  }, [updateFileStatus, processQueue]);

  const removeResult = useCallback((id: string) => {
    setResults((prev) => {
      const result = prev.find((r) => r.id === id);
      if (result) {
        revokeTrackedBlobUrl(result.resultUrl);
      }
      return prev.filter((r) => r.id !== id);
    });
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, [revokeTrackedBlobUrl]);

  const updateResultBackground = useCallback((id: string, option: BackgroundOption) => {
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, backgroundOption: option } : r))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setFiles((prev) => prev.filter((f) => f.status !== 'complete'));
  }, []);

  const clearAll = useCallback(() => {
    results.forEach((r) => revokeTrackedBlobUrl(r.resultUrl));
    setResults([]);
    setFiles([]);
    clearSession();
  }, [results, revokeTrackedBlobUrl]);

  return {
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
    clearCompleted,
    clearAll,
  };
}
