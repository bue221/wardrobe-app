import { useState, useEffect, useCallback } from 'react';
import type { ClothingItem, Category } from '../types';
import { getAllClothing, addClothing, deleteClothing } from '../../shared/db/wardrobeDB';

async function compressImage(file: File, maxPx = 600): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/jpeg', 0.82);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllClothing().then((all) => {
      setItems(all.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    });
  }, []);

  const addItem = useCallback(async (
    file: File,
    name: string,
    category: Category,
    colors: string[]
  ) => {
    const imageBlob = await compressImage(file);
    const item: ClothingItem = {
      id: crypto.randomUUID(),
      name,
      category,
      colors,
      imageBlob,
      createdAt: Date.now(),
    };
    await addClothing(item);
    setItems((prev) => [item, ...prev]);
    return item;
  }, []);

  const removeItem = useCallback(async (id: string) => {
    await deleteClothing(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { items, loading, addItem, removeItem };
}
