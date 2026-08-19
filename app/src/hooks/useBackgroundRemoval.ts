import { useState, useCallback, useRef, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';
import type { Config } from '@imgly/background-removal';
import type { ImageFile, ProcessingResult, FileStatus } from '../types';

// 고품질 배경 제거 설정
const REMOVAL_CONFIG: Config = {
  debug: false,
  progress: undefined,
  model: 'isnet', // 'isnet' | 'isnet_fp16' | 'isnet_quint8' - isnet은 최고 품질
  output: {
    format: 'image/png',
    quality: 1.0,
  },
};

let idCounter = 0;
const generateId = () => `file_${Date.now()}_${++idCounter}`;

export function useBackgroundRemoval() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);
  const filesRef = useRef<ImageFile[]>([]);

  // filesRef를 항상 최신 상태로 유지
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

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

  const processFile = useCallback(async (imageFile: ImageFile): Promise<ProcessingResult | null> => {
    try {
      updateFileStatus(imageFile.id, { status: 'processing', progress: 10 });

      // 프로그레스 시뮬레이션 (실제 라이브러리는 세밀한 프로그레스를 제공하지 않음)
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

      // 배경 제거 실행 - 정교한 AI 모델 사용
      const resultBlob = await removeBackground(imageFile.file, REMOVAL_CONFIG);

      clearInterval(progressInterval);

      updateFileStatus(imageFile.id, { status: 'complete', progress: 100 });

      const resultUrl = URL.createObjectURL(resultBlob);

      return {
        id: imageFile.id,
        originalName: imageFile.name,
        originalPreview: imageFile.preview,
        resultBlob,
        resultUrl,
        size: resultBlob.size,
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
  }, [updateFileStatus]);

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessing(true);

    // filesRef를 사용하여 항상 최신 파일 목록 참조
    let waitingFiles = filesRef.current.filter((f) => f.status === 'waiting');

    while (waitingFiles.length > 0) {
      const file = waitingFiles[0];
      
      const result = await processFile(file);
      if (result) {
        setResults((prev) => [...prev, result]);
      }

      // 다음 대기 파일 확인 (새로 추가된 파일 포함)
      waitingFiles = filesRef.current.filter((f) => f.status === 'waiting');
    }

    processingRef.current = false;
    setIsProcessing(false);
  }, [processFile]);

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
      filesRef.current = updated; // 즉시 ref도 업데이트
      return updated;
    });

    // 자동으로 처리 시작
    if (!processingRef.current) {
      // 약간의 딜레이 후 처리 시작
      setTimeout(() => {
        processQueue();
      }, 50);
    }
  }, [processQueue]);

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
        URL.revokeObjectURL(result.resultUrl);
      }
      return prev.filter((r) => r.id !== id);
    });
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setFiles((prev) => prev.filter((f) => f.status !== 'complete'));
  }, []);

  return {
    files,
    results,
    isProcessing,
    addFiles,
    retryFile,
    removeResult,
    clearCompleted,
  };
}
