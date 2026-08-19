import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { HubImage, HubUploadData } from '../types';

interface HubContextType {
  images: HubImage[];
  isLoading: boolean;
  uploadImage: (data: HubUploadData, authorId: string, authorName: string) => Promise<boolean>;
  deleteImage: (id: string, authorId: string) => boolean;
  likeImage: (id: string) => void;
  getImageById: (id: string) => HubImage | undefined;
}

const HubContext = createContext<HubContextType | null>(null);

const STORAGE_KEY = 'bgcut_hub_images';

// 이미지를 Base64로 변환
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// 고유 ID 생성
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 썸네일 생성 (크기 축소)
const createThumbnail = async (imageUrl: string, maxSize = 300): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = imageUrl;
  });
};

export function HubProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<HubImage[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  const saveImages = useCallback((newImages: HubImage[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
    setImages(newImages);
  }, []);

  const uploadImage = useCallback(async (
    data: HubUploadData,
    authorId: string,
    authorName: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const imageUrl = await blobToBase64(data.imageBlob);
      const thumbnailUrl = await createThumbnail(imageUrl);

      const newImage: HubImage = {
        id: generateId(),
        imageUrl,
        thumbnailUrl,
        title: data.title,
        description: data.description,
        authorId,
        authorName,
        createdAt: new Date().toISOString(),
        downloads: 0,
        likes: 0,
      };

      const updated = [newImage, ...images];
      saveImages(updated);
      return true;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [images, saveImages]);

  const deleteImage = useCallback((id: string, authorId: string): boolean => {
    const image = images.find(img => img.id === id);
    if (!image || image.authorId !== authorId) return false;

    const updated = images.filter(img => img.id !== id);
    saveImages(updated);
    return true;
  }, [images, saveImages]);

  const likeImage = useCallback((id: string) => {
    const updated = images.map(img =>
      img.id === id ? { ...img, likes: img.likes + 1 } : img
    );
    saveImages(updated);
  }, [images, saveImages]);

  const getImageById = useCallback((id: string) => {
    return images.find(img => img.id === id);
  }, [images]);

  return (
    <HubContext.Provider
      value={{
        images,
        isLoading,
        uploadImage,
        deleteImage,
        likeImage,
        getImageById,
      }}
    >
      {children}
    </HubContext.Provider>
  );
}

export function useHub() {
  const context = useContext(HubContext);
  if (!context) {
    throw new Error('useHub must be used within a HubProvider');
  }
  return context;
}
