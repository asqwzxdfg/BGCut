/**
 * 이미지 타입 분석 유틸리티
 * 사진 vs 로고/아이콘을 구분하기 위한 분석 기능
 */

export type ImageType = 'photo' | 'logo' | 'unknown';

export interface ImageAnalysis {
  type: ImageType;
  confidence: number; // 0-1
  uniqueColors: number;
  dominantColor: string;
  backgroundUniformity: number; // 0-1, 1이면 완전 균일
  hasSharpEdges: boolean;
  suggestedMode: 'ai' | 'color';
}

interface ColorCount {
  color: string;
  count: number;
  r: number;
  g: number;
  b: number;
}

/**
 * 이미지를 Canvas에 로드
 */
async function loadImageToCanvas(file: File): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // 분석용으로 이미지 크기 제한 (성능)
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const width = Math.floor(img.width * scale);
      const height = Math.floor(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(img.src);
      resolve({ canvas, ctx });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * RGB를 HEX 색상으로 변환
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * 색상을 양자화 (유사한 색상 그룹화)
 */
function quantizeColor(r: number, g: number, b: number, step: number = 32): string {
  const qr = Math.round(r / step) * step;
  const qg = Math.round(g / step) * step;
  const qb = Math.round(b / step) * step;
  return `${qr},${qg},${qb}`;
}

/**
 * 이미지의 고유 색상 수 분석
 */
function analyzeColors(imageData: ImageData): { uniqueColors: number; colorCounts: ColorCount[] } {
  const colorMap = new Map<string, { count: number; r: number; g: number; b: number }>();
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // 투명 픽셀 무시
    if (a < 128) continue;

    const quantized = quantizeColor(r, g, b);
    const existing = colorMap.get(quantized);
    if (existing) {
      existing.count++;
    } else {
      colorMap.set(quantized, { count: 1, r, g, b });
    }
  }

  const colorCounts: ColorCount[] = Array.from(colorMap.entries())
    .map(([, data]) => ({
      color: rgbToHex(data.r, data.g, data.b),
      count: data.count,
      r: data.r,
      g: data.g,
      b: data.b,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    uniqueColors: colorMap.size,
    colorCounts,
  };
}

/**
 * 테두리 픽셀 분석 (배경 균일도)
 */
function analyzeBorderUniformity(imageData: ImageData): { uniformity: number; dominantBorderColor: ColorCount | null } {
  const { data, width, height } = imageData;
  const borderPixels: Array<{ r: number; g: number; b: number }> = [];

  // 테두리 픽셀 수집 (상하좌우 5픽셀)
  const borderWidth = Math.min(5, Math.floor(width / 10));
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isBorder = x < borderWidth || x >= width - borderWidth || 
                       y < borderWidth || y >= height - borderWidth;
      
      if (isBorder) {
        const i = (y * width + x) * 4;
        const a = data[i + 3];
        if (a >= 128) {
          borderPixels.push({
            r: data[i],
            g: data[i + 1],
            b: data[i + 2],
          });
        }
      }
    }
  }

  if (borderPixels.length === 0) {
    return { uniformity: 0, dominantBorderColor: null };
  }

  // 테두리 색상 분포 분석
  const colorMap = new Map<string, { count: number; r: number; g: number; b: number }>();
  
  for (const pixel of borderPixels) {
    const quantized = quantizeColor(pixel.r, pixel.g, pixel.b, 24); // 더 세밀하게
    const existing = colorMap.get(quantized);
    if (existing) {
      existing.count++;
    } else {
      colorMap.set(quantized, { count: 1, ...pixel });
    }
  }

  const sortedColors = Array.from(colorMap.values()).sort((a, b) => b.count - a.count);
  const dominantColor = sortedColors[0];
  
  if (!dominantColor) {
    return { uniformity: 0, dominantBorderColor: null };
  }

  // 지배적인 색상이 테두리의 몇 %를 차지하는지
  const uniformity = dominantColor.count / borderPixels.length;

  return {
    uniformity,
    dominantBorderColor: {
      color: rgbToHex(dominantColor.r, dominantColor.g, dominantColor.b),
      count: dominantColor.count,
      r: dominantColor.r,
      g: dominantColor.g,
      b: dominantColor.b,
    },
  };
}

/**
 * 이미지 타입 분석 메인 함수
 */
export async function analyzeImage(file: File): Promise<ImageAnalysis> {
  const { canvas, ctx } = await loadImageToCanvas(file);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const { uniqueColors, colorCounts } = analyzeColors(imageData);
  const { uniformity, dominantBorderColor } = analyzeBorderUniformity(imageData);

  // 판단 로직
  let type: ImageType = 'unknown';
  let confidence = 0.5;
  let suggestedMode: 'ai' | 'color' = 'ai';

  // 로고/아이콘 판단 기준
  const isLikelyLogo = 
    uniqueColors < 30 && // 색상 수가 적음
    uniformity > 0.6;     // 테두리가 균일함

  const isLikelyPhoto =
    uniqueColors > 100 || // 색상 수가 많음
    uniformity < 0.3;     // 테두리가 복잡함

  if (isLikelyLogo) {
    type = 'logo';
    confidence = Math.min(0.9, 0.5 + (1 - uniqueColors / 50) * 0.3 + uniformity * 0.2);
    suggestedMode = 'color';
  } else if (isLikelyPhoto) {
    type = 'photo';
    confidence = Math.min(0.9, 0.5 + Math.min(uniqueColors / 200, 0.3) + (1 - uniformity) * 0.2);
    suggestedMode = 'ai';
  } else {
    // 애매한 경우
    type = 'unknown';
    confidence = 0.5;
    // 배경이 균일하면 color 모드 추천
    suggestedMode = uniformity > 0.5 ? 'color' : 'ai';
  }

  return {
    type,
    confidence,
    uniqueColors,
    dominantColor: dominantBorderColor?.color || colorCounts[0]?.color || '#ffffff',
    backgroundUniformity: uniformity,
    hasSharpEdges: uniqueColors < 50, // 단순 휴리스틱
    suggestedMode,
  };
}

/**
 * 빠른 배경색 감지 (테두리 기반)
 */
export async function detectBackgroundColor(file: File): Promise<{ color: string; r: number; g: number; b: number } | null> {
  const { canvas, ctx } = await loadImageToCanvas(file);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  const { dominantBorderColor } = analyzeBorderUniformity(imageData);
  
  if (dominantBorderColor) {
    return {
      color: dominantBorderColor.color,
      r: dominantBorderColor.r,
      g: dominantBorderColor.g,
      b: dominantBorderColor.b,
    };
  }
  
  return null;
}
