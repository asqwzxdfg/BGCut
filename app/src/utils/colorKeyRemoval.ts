/**
 * 색상 기반 배경 제거 (Color Keying)
 * 로고, 아이콘 등 단색 배경 이미지에 적합
 */

export interface ColorKeyOptions {
  /** 제거할 배경 색상 (자동 감지 시 null) */
  targetColor?: { r: number; g: number; b: number } | null;
  /** 색상 허용 오차 (0-255, 기본 30) */
  tolerance?: number;
  /** 가장자리 부드럽게 처리 여부 */
  feather?: boolean;
  /** 페더 강도 (0-1) */
  featherAmount?: number;
  /** 그림자/음영 제거 강도 (0-1, 0이면 비활성) */
  shadowRemoval?: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * 두 색상 간의 거리 계산
 */
function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c2.r - c1.r, 2) +
    Math.pow(c2.g - c1.g, 2) +
    Math.pow(c2.b - c1.b, 2)
  );
}

/**
 * 색상의 밝기 계산 (0-255)
 */
function getBrightness(c: RGB): number {
  return (c.r * 299 + c.g * 587 + c.b * 114) / 1000;
}

/**
 * 색상이 회색조인지 판단 (채도가 낮은지)
 */
function isGrayish(c: RGB, threshold: number = 30): boolean {
  const max = Math.max(c.r, c.g, c.b);
  const min = Math.min(c.r, c.g, c.b);
  return (max - min) <= threshold;
}

/**
 * 두 색상이 같은 색조(hue)인지 판단 (그림자/음영 감지용)
 */
function isSameHue(c1: RGB, c2: RGB, threshold: number = 0.15): boolean {
  // 둘 다 회색조면 같은 색조로 간주
  if (isGrayish(c1) && isGrayish(c2)) {
    return true;
  }
  
  // 채도가 매우 낮으면 색조 비교 무의미
  const sat1 = (Math.max(c1.r, c1.g, c1.b) - Math.min(c1.r, c1.g, c1.b)) / 255;
  const sat2 = (Math.max(c2.r, c2.g, c2.b) - Math.min(c2.r, c2.g, c2.b)) / 255;
  
  if (sat1 < 0.1 || sat2 < 0.1) {
    return true;
  }
  
  // 정규화된 RGB 비율 비교
  const sum1 = c1.r + c1.g + c1.b || 1;
  const sum2 = c2.r + c2.g + c2.b || 1;
  
  const r1 = c1.r / sum1, g1 = c1.g / sum1, b1 = c1.b / sum1;
  const r2 = c2.r / sum2, g2 = c2.g / sum2, b2 = c2.b / sum2;
  
  const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
  return diff <= threshold;
}

/**
 * 이미지의 테두리에서 가장 많은 색상 감지 (배경색 추정)
 */
function detectBackgroundColorFromBorder(imageData: ImageData): RGB {
  const { data, width, height } = imageData;
  const colorMap = new Map<string, { count: number; r: number; g: number; b: number }>();
  
  const borderWidth = Math.max(3, Math.floor(Math.min(width, height) / 20));

  // 테두리 픽셀 수집
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isBorder = 
        x < borderWidth || 
        x >= width - borderWidth || 
        y < borderWidth || 
        y >= height - borderWidth;
      
      if (isBorder) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // 투명하지 않은 픽셀만
        if (a > 128) {
          // 색상 양자화 (비슷한 색상 그룹화)
          const qr = Math.round(r / 16) * 16;
          const qg = Math.round(g / 16) * 16;
          const qb = Math.round(b / 16) * 16;
          const key = `${qr},${qg},${qb}`;
          
          const existing = colorMap.get(key);
          if (existing) {
            existing.count++;
            // 평균 색상 업데이트
            existing.r = Math.round((existing.r * (existing.count - 1) + r) / existing.count);
            existing.g = Math.round((existing.g * (existing.count - 1) + g) / existing.count);
            existing.b = Math.round((existing.b * (existing.count - 1) + b) / existing.count);
          } else {
            colorMap.set(key, { count: 1, r, g, b });
          }
        }
      }
    }
  }

  // 가장 많은 색상 찾기
  let maxCount = 0;
  let dominantColor: RGB = { r: 255, g: 255, b: 255 }; // 기본값: 흰색

  colorMap.forEach((value) => {
    if (value.count > maxCount) {
      maxCount = value.count;
      dominantColor = { r: value.r, g: value.g, b: value.b };
    }
  });

  return dominantColor;
}

/**
 * 색상 기반 배경 제거 메인 함수
 */
export async function removeBackgroundByColor(
  file: File,
  options: ColorKeyOptions = {}
): Promise<Blob> {
  const {
    targetColor = null,
    tolerance = 35,
    feather = true,
    featherAmount = 0.5,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        URL.revokeObjectURL(img.src);
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      URL.revokeObjectURL(img.src);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      // 배경색 결정
      const bgColor = targetColor || detectBackgroundColorFromBorder(imageData);

      // 최대 색상 거리 (tolerance 기준)
      const maxDistance = tolerance * Math.sqrt(3); // RGB 공간에서 최대 거리 보정

      // 각 픽셀 처리
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const distance = colorDistance({ r, g, b }, bgColor);

        if (distance <= tolerance) {
          // 배경색과 일치 - 완전 투명
          data[i + 3] = 0;
        } else if (feather && distance <= maxDistance) {
          // 페더링 영역 - 부분 투명
          const ratio = (distance - tolerance) / (maxDistance - tolerance);
          const alpha = Math.round(255 * Math.pow(ratio, featherAmount));
          data[i + 3] = Math.min(data[i + 3], alpha);
        }
        // 그 외는 원본 유지
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * 특정 좌표의 색상을 기준으로 배경 제거 (사용자가 클릭한 색상)
 */
export async function removeBackgroundByClickedColor(
  file: File,
  clickX: number,
  clickY: number,
  options: Omit<ColorKeyOptions, 'targetColor'> = {}
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        URL.revokeObjectURL(img.src);
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      URL.revokeObjectURL(img.src);

      // 클릭한 좌표의 색상 가져오기
      const x = Math.floor(clickX * img.width);
      const y = Math.floor(clickY * img.height);
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      
      const targetColor = {
        r: pixelData[0],
        g: pixelData[1],
        b: pixelData[2],
      };

      // 해당 색상으로 배경 제거 실행
      removeBackgroundByColor(file, { ...options, targetColor })
        .then(resolve)
        .catch(reject);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Flood Fill 방식으로 연결된 영역만 투명화
 * (테두리에서 시작해서 연결된 배경만 제거)
 * 그림자/음영도 함께 제거 가능
 */
export async function removeBackgroundByFloodFill(
  file: File,
  options: ColorKeyOptions = {}
): Promise<Blob> {
  const { 
    tolerance = 45,
    shadowRemoval = 0.8,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        URL.revokeObjectURL(img.src);
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      URL.revokeObjectURL(img.src);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data, width, height } = imageData;
      
      // 방문 체크 배열
      const visited = new Uint8Array(width * height);
      // 투명화된 픽셀 마킹
      const transparent = new Uint8Array(width * height);

      // 배경색 감지
      const bgColor = detectBackgroundColorFromBorder(imageData);
      const bgBrightness = getBrightness(bgColor);

      // 그림자 허용 범위 계산
      const shadowTolerance = tolerance + (shadowRemoval * 70);
      const brightnessTolerance = shadowRemoval * 100;

      /**
       * 픽셀이 배경 또는 그림자인지 판단
       */
      const isBackgroundOrShadow = (pixelColor: RGB): boolean => {
        const distance = colorDistance(pixelColor, bgColor);
        
        // 1. 기본 색상 거리 체크
        if (distance <= tolerance) {
          return true;
        }
        
        // 2. 그림자 제거
        if (shadowRemoval > 0) {
          const pixelBrightness = getBrightness(pixelColor);
          
          if (isSameHue(pixelColor, bgColor)) {
            // 밝은 배경 (흰색 계열)
            if (bgBrightness > 200) {
              if (pixelBrightness >= bgBrightness - brightnessTolerance && distance <= shadowTolerance) {
                return true;
              }
            }
            else if (bgBrightness > 100) {
              if (Math.abs(pixelBrightness - bgBrightness) <= brightnessTolerance && distance <= shadowTolerance) {
                return true;
              }
            }
          }
          
          // 회색조 그림자
          if (isGrayish(pixelColor, 50) && distance <= shadowTolerance) {
            if (bgBrightness > 180 && pixelBrightness > bgBrightness - brightnessTolerance - 40) {
              return true;
            }
          }
        }
        
        return false;
      };

      // 테두리에서 시작하는 시작점들 수집
      const startPoints: Array<{ x: number; y: number }> = [];
      
      for (let x = 0; x < width; x++) {
        startPoints.push({ x, y: 0 });
        startPoints.push({ x, y: height - 1 });
      }
      for (let y = 1; y < height - 1; y++) {
        startPoints.push({ x: 0, y });
        startPoints.push({ x: width - 1, y });
      }

      // BFS로 연결된 배경 영역 찾기
      const queue: Array<{ x: number; y: number }> = [];
      
      for (const point of startPoints) {
        const idx = point.y * width + point.x;
        if (visited[idx]) continue;
        
        const i = idx * 4;
        const pixelColor = { r: data[i], g: data[i + 1], b: data[i + 2] };
        
        if (isBackgroundOrShadow(pixelColor)) {
          queue.push(point);
          visited[idx] = 1;
        }
      }

      // BFS 실행 - 1차 제거
      while (queue.length > 0) {
        const { x, y } = queue.shift()!;
        const idx = y * width + x;
        const i = idx * 4;

        // 투명화
        data[i + 3] = 0;
        transparent[idx] = 1;

        // 8방향 이웃 확인
        const neighbors = [
          { x: x - 1, y },
          { x: x + 1, y },
          { x, y: y - 1 },
          { x, y: y + 1 },
          { x: x - 1, y: y - 1 },
          { x: x + 1, y: y - 1 },
          { x: x - 1, y: y + 1 },
          { x: x + 1, y: y + 1 },
        ];

        for (const neighbor of neighbors) {
          if (
            neighbor.x >= 0 && neighbor.x < width &&
            neighbor.y >= 0 && neighbor.y < height
          ) {
            const nIdx = neighbor.y * width + neighbor.x;
            if (!visited[nIdx]) {
              const ni = nIdx * 4;
              const neighborColor = { r: data[ni], g: data[ni + 1], b: data[ni + 2] };
              
              if (isBackgroundOrShadow(neighborColor)) {
                visited[nIdx] = 1;
                queue.push(neighbor);
              }
            }
          }
        }
      }

      // 2차: 가장자리 정리 (Edge cleanup)
      // 투명 영역과 인접한 연한 픽셀들 추가 제거
      const edgeCleanupPasses = 2;
      
      for (let pass = 0; pass < edgeCleanupPasses; pass++) {
        const toRemove: number[] = [];
        
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x;
            
            // 이미 투명하면 스킵
            if (transparent[idx]) continue;
            
            const i = idx * 4;
            const pixelColor = { r: data[i], g: data[i + 1], b: data[i + 2] };
            const pixelBrightness = getBrightness(pixelColor);
            
            // 주변 8픽셀 중 투명 픽셀 개수 카운트
            let transparentNeighbors = 0;
            const neighborOffsets = [
              -width - 1, -width, -width + 1,
              -1, 1,
              width - 1, width, width + 1
            ];
            
            for (const offset of neighborOffsets) {
              if (transparent[idx + offset]) {
                transparentNeighbors++;
              }
            }
            
            // 투명 픽셀과 2개 이상 인접하고, 배경색과 유사하면 제거
            if (transparentNeighbors >= 2) {
              const distance = colorDistance(pixelColor, bgColor);
              
              // 안티앨리어싱 픽셀 감지: 밝은 픽셀이고 배경과 비슷한 경우
              const isAntiAliasingPixel = 
                (bgBrightness > 200 && pixelBrightness > 180 && distance <= shadowTolerance + 20) ||
                (isGrayish(pixelColor, 60) && pixelBrightness > 150);
              
              // 경계의 연한 픽셀
              const isLightEdgePixel = 
                distance <= shadowTolerance && 
                pixelBrightness > bgBrightness - 80;
              
              if (isAntiAliasingPixel || isLightEdgePixel) {
                toRemove.push(idx);
              }
            }
            
            // 3개 이상 인접하고 밝은 픽셀이면 더 적극적으로 제거
            if (transparentNeighbors >= 3 && pixelBrightness > 200) {
              const distance = colorDistance(pixelColor, bgColor);
              if (distance <= shadowTolerance + 30) {
                toRemove.push(idx);
              }
            }
          }
        }
        
        // 마킹된 픽셀 투명화
        for (const idx of toRemove) {
          data[idx * 4 + 3] = 0;
          transparent[idx] = 1;
        }
      }

      // 3차: 가장자리 알파 블렌딩 (부드러운 경계)
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x;
          
          if (transparent[idx]) continue;
          
          const i = idx * 4;
          
          // 주변 투명 픽셀 개수
          let transparentNeighbors = 0;
          const neighborOffsets = [-width - 1, -width, -width + 1, -1, 1, width - 1, width, width + 1];
          
          for (const offset of neighborOffsets) {
            if (transparent[idx + offset]) {
              transparentNeighbors++;
            }
          }
          
          // 투명 영역과 인접한 경계 픽셀의 알파값 조정
          if (transparentNeighbors >= 1 && transparentNeighbors <= 4) {
            const pixelColor = { r: data[i], g: data[i + 1], b: data[i + 2] };
            const distance = colorDistance(pixelColor, bgColor);
            
            // 배경색과 가까우면 반투명 처리
            if (distance <= shadowTolerance) {
              const alphaReduction = Math.min(1, distance / shadowTolerance);
              data[i + 3] = Math.round(255 * alphaReduction * alphaReduction);
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}
