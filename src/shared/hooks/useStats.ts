import { useState, useEffect } from 'react';
import { getAllOutfits } from '../db/wardrobeDB';

export interface WardrobeStats {
  usageMap: Record<string, number>;
  totalOutfits: number;
  topItemId: string | null;
}

export function useStats(): WardrobeStats {
  const [stats, setStats] = useState<WardrobeStats>({
    usageMap: {},
    totalOutfits: 0,
    topItemId: null,
  });

  useEffect(() => {
    getAllOutfits().then((outfits) => {
      const map: Record<string, number> = {};
      for (const outfit of outfits) {
        for (const id of outfit.clothingIds) {
          map[id] = (map[id] || 0) + 1;
        }
      }
      const topItemId = Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
      setStats({ usageMap: map, totalOutfits: outfits.length, topItemId });
    });
  }, []);

  return stats;
}
