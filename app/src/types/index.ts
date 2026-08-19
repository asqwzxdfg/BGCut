export type FileStatus = 'waiting' | 'processing' | 'complete' | 'error';

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  preview: string;
  status: FileStatus;
  progress: number;
  result?: string;
  error?: string;
}

export interface ProcessingResult {
  id: string;
  originalName: string;
  originalPreview: string;
  resultBlob: Blob;
  resultUrl: string;
  size: number;
}

// 사용자 플랜 타입
export type UserPlan = 'free' | 'pro';

// 사용자 정보
export interface User {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  createdAt: string;
}

// 사용량 정보
export interface UsageInfo {
  date: string; // YYYY-MM-DD
  count: number;
}

// 인증 상태
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// 배경 커스텀 옵션 (Pro 기능)
export type BackgroundType = 'transparent' | 'color' | 'image';

export interface BackgroundOption {
  type: BackgroundType;
  color?: string; // hex color for 'color' type
  imageUrl?: string; // image URL for 'image' type
}
