export type FileStatus = 'waiting' | 'processing' | 'complete' | 'error';

// 배경 제거 모드
export type RemovalMode = 'auto' | 'ai' | 'logo';

export interface RemovalModeInfo {
  mode: RemovalMode;
  label: string;
  description: string;
}

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
  /** 사용된 배경 제거 모드 */
  usedMode?: RemovalMode;
}

export interface ProcessingResult {
  id: string;
  originalName: string;
  originalPreview: string;
  resultBlob: Blob;
  resultUrl: string;
  size: number;
  // 각 결과별 배경 옵션 (Pro 기능)
  backgroundOption?: BackgroundOption;
  /** 사용된 배경 제거 모드 */
  usedMode?: RemovalMode;
  /** 원본 파일 참조 (재시도용) */
  originalFile?: File;
}

// 세션 저장용 직렬화된 결과 (Blob 제외)
export interface SerializedResult {
  id: string;
  originalName: string;
  originalPreview: string; // base64
  resultBase64: string; // base64
  size: number;
  backgroundOption?: BackgroundOption;
  usedMode?: RemovalMode;
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
  color?: string;
  imageUrl?: string;
  // 이미지 배경 에디터 옵션
  imageSettings?: {
    x: number; // 배경 이미지 X 위치 (%)
    y: number; // 배경 이미지 Y 위치 (%)
    scale: number; // 확대/축소 (1 = 100%)
    opacity: number; // 투명도 (0-1)
    cropEnabled?: boolean;
    cropX?: number;
    cropY?: number;
    cropWidth?: number;
    cropHeight?: number;
  };
}

// 허브 이미지 타입
export interface HubImage {
  id: string;
  imageUrl: string; // base64 또는 blob URL
  thumbnailUrl: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  downloads: number;
  likes: number;
}

// 허브 업로드 데이터
export interface HubUploadData {
  title: string;
  description: string;
  imageBlob: Blob;
}
