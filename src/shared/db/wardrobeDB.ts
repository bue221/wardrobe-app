import { openDB, type IDBPDatabase } from 'idb';
import type { ClothingItem } from '../../wardrobe/types';
import type { SavedOutfit } from '../../outfits/types';

interface WardrobeDB {
  clothing: {
    key: string;
    value: ClothingItem;
  };
  outfits: {
    key: string;
    value: SavedOutfit;
  };
}

let db: IDBPDatabase<WardrobeDB> | null = null;

async function getDB() {
  if (db) return db;
  db = await openDB<WardrobeDB>('wardrobe-app', 1, {
    upgrade(database) {
      database.createObjectStore('clothing', { keyPath: 'id' });
      database.createObjectStore('outfits', { keyPath: 'id' });
    },
  });
  return db;
}

export async function getAllClothing(): Promise<ClothingItem[]> {
  const database = await getDB();
  return database.getAll('clothing');
}

export async function addClothing(item: ClothingItem): Promise<void> {
  const database = await getDB();
  await database.put('clothing', item);
}

export async function deleteClothing(id: string): Promise<void> {
  const database = await getDB();
  await database.delete('clothing', id);
}

export async function getAllOutfits(): Promise<SavedOutfit[]> {
  const database = await getDB();
  const all = await database.getAll('outfits');
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveOutfit(outfit: SavedOutfit): Promise<void> {
  const database = await getDB();
  await database.put('outfits', outfit);
}

export async function deleteOutfit(id: string): Promise<void> {
  const database = await getDB();
  await database.delete('outfits', id);
}
