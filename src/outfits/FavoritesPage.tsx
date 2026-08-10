import { useWardrobe } from '../wardrobe/hooks/useWardrobe';
import { useOutfitGenerator } from './hooks/useOutfitGenerator';
import { OutfitHistory } from './components/OutfitHistory';
import { Toast } from '../shared/components/Toast';
import { useState } from 'react';

export function FavoritesPage() {
  const { items } = useWardrobe();
  const { savedOutfits, loadSavedOutfits, removeSavedOutfit } = useOutfitGenerator();
  const [toast, setToast] = useState<string | null>(null);

  async function handleDelete(id: string) {
    await removeSavedOutfit(id);
    setToast('Outfit eliminado');
  }

  return (
    <div className="space-y-4">
      <h1 className="text-white text-xl font-bold">Favoritos</h1>
      <OutfitHistory
        outfits={savedOutfits}
        allItems={items}
        onLoad={loadSavedOutfits}
        onDelete={handleDelete}
      />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
