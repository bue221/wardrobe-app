import { useWardrobe } from '../wardrobe/hooks/useWardrobe';
import { useOutfitGenerator } from './hooks/useOutfitGenerator';
import { OutfitHistory } from './components/OutfitHistory';
import { Toast } from '../shared/components/Toast';
import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';

export function FavoritesPage() {
  const { t } = useI18n();
  const { items } = useWardrobe();
  const { savedOutfits, loadSavedOutfits, removeSavedOutfit } = useOutfitGenerator();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  async function handleDelete(id: string) {
    try {
      await removeSavedOutfit(id);
      setToast({ message: t('favorites.deleted'), type: 'success' });
    } catch (error) {
      console.error('Failed to delete outfit', error);
      setToast({ message: t('favorites.deleteFailed'), type: 'error' });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-heading leading-heading tracking-[0.02em] text-ink">
        {t('favorites.title')}
      </h1>
      <OutfitHistory
        outfits={savedOutfits}
        allItems={items}
        onLoad={loadSavedOutfits}
        onDelete={handleDelete}
      />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
