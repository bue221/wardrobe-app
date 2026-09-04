import { useState } from 'react';
import { useWardrobe } from '../wardrobe/hooks/useWardrobe';
import { useOutfitGenerator } from './hooks/useOutfitGenerator';
import { useWebGPU } from '../shared/hooks/useWebGPU';
import { OutfitDisplay } from './components/OutfitDisplay';
import { Toast } from '../shared/components/Toast';
import { Button } from '../shared/ui/Button';
import { EmptyState } from '../shared/ui/EmptyState';
import { useI18n } from '../i18n/I18nProvider';

export function OutfitPage() {
  const { t } = useI18n();
  const { items } = useWardrobe();
  const webGpuSupported = useWebGPU();
  const { status, generateRandom, generateAI, saveCurrentOutfit, reset } = useOutfitGenerator();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const isLoading = status.type === 'loading-model' || status.type === 'generating';
  const isDone = status.type === 'done';

  async function handleSave() {
    if (status.type !== 'done') return;
    try {
      await saveCurrentOutfit(status.ids, status.note, status.source);
      setToast({ message: t('outfit.saved'), type: 'success' });
      reset();
    } catch (error) {
      console.error('Failed to save outfit', error);
      setToast({ message: t('outfit.saveFailed'), type: 'error' });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-heading leading-heading tracking-[0.02em] text-ink">
        {t('outfit.title')}
      </h1>

      {items.length === 0 && (
        <EmptyState title={t('outfit.emptyTitle')} body={t('outfit.emptyBody')} />
      )}

      {items.length > 0 && (
        <div className="flex flex-col gap-4">
          {webGpuSupported === true && (
            <Button onClick={() => generateAI(items)} disabled={isLoading} className="w-full">
              {t('outfit.ai')}
            </Button>
          )}
          <Button variant="secondary" onClick={() => generateRandom(items)} disabled={isLoading} className="w-full">
            {t('outfit.random')}
          </Button>

          {status.type === 'loading-model' && (
            <div className="flex flex-col gap-2 rounded-card bg-surface p-6">
              <div className="flex justify-between font-dm-sans font-medium text-body-sm leading-body-sm">
                <span>{t('outfit.loadingModel')}</span>
                <span>{status.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-pill bg-canvas">
                <div
                  className="h-2 rounded-pill bg-ember transition-all duration-300"
                  style={{ width: `${status.progress}%` }}
                />
              </div>
              <p className="truncate font-system text-caption leading-caption text-ink">{status.text}</p>
              <p className="font-system text-caption leading-caption text-ink/70">
                {t('outfit.loadingHint')}
              </p>
            </div>
          )}

          {status.type === 'generating' && (
            <p className="py-4 text-center font-dm-sans font-medium text-body-sm leading-body-sm text-ink">
              {t('outfit.generating')}
            </p>
          )}

          {status.type === 'error' && (
            <div className="rounded-card bg-surface p-6" role="alert">
              <p className="font-dm-sans font-medium text-body-sm leading-body-sm text-ember">{status.message}</p>
            </div>
          )}

          {isDone && (
            <OutfitDisplay
              selectedIds={status.ids}
              allItems={items}
              note={status.note}
              source={status.source}
              onSave={handleSave}
            />
          )}
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
