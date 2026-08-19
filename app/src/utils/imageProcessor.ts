import type { BackgroundOption } from '../types';

/**
 * 투명 배경 이미지에 새로운 배경을 합성
 */
export async function applyBackground(
  imageBlob: Blob,
  backgroundOption: BackgroundOption
): Promise<Blob> {
  // 투명 배경이면 원본 반환
  if (backgroundOption.type === 'transparent') {
    return imageBlob;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // 배경 그리기
      if (backgroundOption.type === 'color' && backgroundOption.color) {
        ctx.fillStyle = backgroundOption.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 전경 이미지 그리기
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png', 1.0);
        
      } else if (backgroundOption.type === 'image' && backgroundOption.imageUrl) {
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        
        bgImg.onload = () => {
          // 배경 이미지를 캔버스 크기에 맞게 그리기 (cover 방식)
          const scale = Math.max(
            canvas.width / bgImg.width,
            canvas.height / bgImg.height
          );
          const bgWidth = bgImg.width * scale;
          const bgHeight = bgImg.height * scale;
          const bgX = (canvas.width - bgWidth) / 2;
          const bgY = (canvas.height - bgHeight) / 2;
          
          ctx.drawImage(bgImg, bgX, bgY, bgWidth, bgHeight);
          
          // 전경 이미지 그리기
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/png', 1.0);
        };
        
        bgImg.onerror = () => {
          reject(new Error('Failed to load background image'));
        };
        
        bgImg.src = backgroundOption.imageUrl;
      } else {
        // 기본: 투명 배경 유지
        resolve(imageBlob);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(imageBlob);
  });
}

/**
 * 이미지 미리보기 URL 생성 (배경 적용된 버전)
 */
export async function createPreviewWithBackground(
  imageBlob: Blob,
  backgroundOption: BackgroundOption
): Promise<string> {
  const resultBlob = await applyBackground(imageBlob, backgroundOption);
  return URL.createObjectURL(resultBlob);
}
