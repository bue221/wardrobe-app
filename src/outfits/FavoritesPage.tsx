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
    try {
      await removeSavedOutfit(id);
      setToast('Outfit eliminado');
    } catch (err) {
      console.error('Failed to delete outfit', err);
      setToast('No se pudo eliminar');
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display text-[32px] md:text-[48px] leading-[1] tracking-[0.64px] text-obsidian">
        FAVORITOS
      </h1>
      <OutfitHistory
        outfits={savedOutfits}
        allItems={items}
        onLoad={loadSavedOutfits}
        onDelete={handleDelete}
      />
      {toast && (
        <Toast
          message={toast}
          type={toast.includes('No se pudo') ? 'error' : 'info'}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
