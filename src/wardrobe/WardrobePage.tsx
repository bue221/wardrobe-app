import { useState } from 'react';
import { useWardrobe } from './hooks/useWardrobe';
import { useStats } from '../shared/hooks/useStats';
import { ClothingGrid } from './components/ClothingGrid';
import { FilterBar } from './components/FilterBar';
import { UploadForm } from './components/UploadForm';
import { Toast } from '../shared/components/Toast';
import { seedWardrobe } from './utils/seedWardrobe';
import type { Category } from './types';
import { Button } from '../shared/ui/Button';
import { EmptyState } from '../shared/ui/EmptyState';
import { Tag } from '../shared/ui/Tag';
import { useI18n } from '../i18n/I18nProvider';

export function WardrobePage() {
  const { t } = useI18n();
  const { items, loading, addItem, removeItem } = useWardrobe();
  const { usageMap, totalOutfits, topItemId } = useStats();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [seeding, setSeeding] = useState(false);

  const filtered = items.filter((i) => {
    const matchesCategory = filter === 'all' || i.category === filter;
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const topItem = items.find((i) => i.id === topItemId);

  async function handleAdd(file: File, name: string, category: Category, colors: string[]) {
    try {
      await addItem(file, name, category, colors);
      setToast({ message: t('wardrobe.saved'), type: 'success' });
    } catch (error) {
      console.error('Failed to save clothing item', error);
      setToast({ message: t('wardrobe.saveFailed'), type: 'error' });
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      const { added, skipped } = await seedWardrobe(
        addItem,
        items.map((item) => item.name),
      );
      if (added === 0 && skipped > 0) {
        setToast({ message: t('wardrobe.seedAlready'), type: 'success' });
      } else if (skipped > 0) {
        setToast({ message: t('wardrobe.seedMixed', { added, skipped }), type: 'success' });
      } else {
        setToast({ message: t('wardrobe.seedDone', { added }), type: 'success' });
      }
    } catch (error) {
      console.error('Failed to seed wardrobe', error);
      setToast({ message: t('wardrobe.seedFailed'), type: 'error' });
    } finally {
      setSeeding(false);
    }
  }

  const isEmpty = !loading && items.length === 0;
  const noResults = !loading && items.length > 0 && filtered.length === 0;
  const countLabel =
    items.length === 1
      ? t('wardrobe.countOne', { n: items.length })
      : t('wardrobe.countMany', { n: items.length });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-heading leading-heading tracking-[0.02em] text-ink">
            {t('wardrobe.title')}
          </h1>
          {!loading && items.length > 0 && (
            <p className="mt-1 font-system text-caption leading-caption text-ink">
              {countLabel}
              {totalOutfits > 0 && ` · ${t('wardrobe.outfits', { n: totalOutfits })}`}
            </p>
          )}
        </div>
        {items.length > 0 && <Button onClick={() => setShowUpload(true)}>{t('wardrobe.add')}</Button>}
      </div>

      {!loading && items.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {topItem && <Tag>{t('wardrobe.top', { name: topItem.name })}</Tag>}
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="ml-auto min-h-11 font-system text-caption leading-caption text-ink disabled:opacity-40"
          >
            {seeding ? t('wardrobe.loadingExamples') : t('wardrobe.examples')}
          </button>
        </div>
      )}

      {items.length > 0 && (
        <>
          <input
            type="search"
            placeholder={t('wardrobe.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t('wardrobe.searchAria')}
            className="w-full rounded-input border-[1.5px] border-solid border-ink bg-surface px-8 py-3 font-dm-sans font-medium text-base text-ink outline-none placeholder:text-ink/40"
          />

          <FilterBar active={filter} onChange={setFilter} />
        </>
      )}

      {loading && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-card bg-surface" />
          ))}
        </div>
      )}

      {isEmpty && (
        <EmptyState title={t('wardrobe.emptyTitle')} body={t('wardrobe.emptyBody')}>
          <div className="flex w-full max-w-xs flex-col gap-3">
            <Button onClick={() => setShowUpload(true)}>{t('wardrobe.addItem')}</Button>
            <Button variant="secondary" onClick={handleSeed} disabled={seeding}>
              {seeding ? t('wardrobe.loadingExamplesLong') : t('wardrobe.loadExamples')}
            </Button>
          </div>
        </EmptyState>
      )}

      {noResults && (
        <EmptyState title={t('wardrobe.noResultsTitle')} body={t('wardrobe.noResultsBody')}>
          <Button
            variant="secondary"
            onClick={() => {
              setFilter('all');
              setSearch('');
            }}
          >
            {t('wardrobe.clearFilters')}
          </Button>
        </EmptyState>
      )}

      {!loading && filtered.length > 0 && (
        <ClothingGrid items={filtered} usageMap={usageMap} onDelete={removeItem} />
      )}

      {showUpload && <UploadForm onAdd={handleAdd} onClose={() => setShowUpload(false)} />}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
