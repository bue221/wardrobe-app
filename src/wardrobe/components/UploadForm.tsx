import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import type { Category } from '../types';
import { CATEGORIES, PRESET_COLOR_KEYS } from '../types';
import { Button } from '../../shared/ui/Button';
import { useI18n } from '../../i18n/I18nProvider';
import { categoryLabel, colorLabel } from '../../i18n/labels';
import { extractPresetColorsFromFile } from '../utils/extractGarmentColors';
import { classifyGarmentCategory } from '../utils/classifyGarmentCategory';
import { suggestGarmentName } from '../utils/suggestGarmentName';

interface UploadFormProps {
  onAdd: (file: File, name: string, category: Category, colors: string[]) => Promise<void>;
  onClose: () => void;
}

type HintStatus = 'idle' | 'analyzing' | 'pick-category' | 'ready';

export function UploadForm({ onAdd, onClose }: UploadFormProps) {
  const { t } = useI18n();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<HintStatus>('idle');
  const nameLockedRef = useRef(false);
  const categoryLockedRef = useRef(false);
  const colorsRef = useRef<string[]>([]);
  const analysisRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function replaceColors(next: string[]) {
    colorsRef.current = next;
    setColors(next);
  }

  function applySuggestedName(nextCategory: Category, nextColors: string[]) {
    if (nameLockedRef.current) return;
    setName(suggestGarmentName(nextCategory, nextColors));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0];
    if (!chosen) return;
    if (!chosen.type.startsWith('image/')) {
      setError(t('upload.needImage'));
      return;
    }

    setError(null);
    setFile(chosen);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(chosen);
    });
    nameLockedRef.current = false;
    categoryLockedRef.current = false;
    setName('');
    setCategory(null);
    replaceColors([]);
    setHint('analyzing');

    const requestId = analysisRef.current + 1;
    analysisRef.current = requestId;

    void (async () => {
      try {
        const extracted = await extractPresetColorsFromFile(chosen);
        if (analysisRef.current !== requestId) return;
        replaceColors(extracted);
        setHint('pick-category');
      } catch (err) {
        console.error('Failed to read garment colors', err);
        if (analysisRef.current !== requestId) return;
        setHint('pick-category');
      }

      const guessed = await classifyGarmentCategory(chosen);
      if (analysisRef.current !== requestId) return;
      if (!guessed || categoryLockedRef.current) return;
      setCategory(guessed);
      applySuggestedName(guessed, colorsRef.current);
      setHint('ready');
    })();
  }

  function selectCategory(next: Category) {
    categoryLockedRef.current = true;
    setCategory(next);
    applySuggestedName(next, colorsRef.current);
    if (file) setHint('ready');
  }

  function toggleColor(color: string) {
    const next = colorsRef.current.includes(color)
      ? colorsRef.current.filter((c) => c !== color)
      : [...colorsRef.current, color];
    replaceColors(next);
    if (category) applySuggestedName(category, next);
  }

  async function handleSubmit() {
    if (!file || !name.trim() || !category) return;
    setSaving(true);
    setError(null);
    try {
      await onAdd(file, name.trim(), category, colors);
      onClose();
    } catch (err) {
      console.error('Failed to add clothing item', err);
      setError(t('upload.saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  const hintCopy =
    hint === 'analyzing'
      ? t('upload.analyzing')
      : hint === 'ready'
        ? t('upload.hintReady')
        : hint === 'pick-category'
          ? t('upload.hintPickCategory')
          : null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-obsidian/60 md:items-center md:p-4">
      <div
        className="max-h-[90dvh] w-full overflow-y-auto rounded-t-card bg-surface p-6 md:max-w-md md:rounded-card md:p-10"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
        role="dialog"
        aria-labelledby="upload-title"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="upload-title" className="font-display text-heading leading-heading tracking-[0.02em] text-ink">
            {t('upload.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-pill bg-canvas text-ink"
            aria-label={t('upload.close')}
          >
            ✕
          </button>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-card bg-canvas"
        >
          {preview ? (
            <img src={preview} alt={t('upload.preview')} className="h-full w-full object-cover" />
          ) : (
            <span className="font-dm-sans font-medium text-body-sm leading-body-sm text-ink">
              {t('upload.pickPhoto')}
            </span>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {hintCopy && (
          <p className="mt-3 font-system text-caption leading-caption text-ink" aria-live="polite">
            {hintCopy}
          </p>
        )}

        <input
          type="text"
          placeholder={t('upload.namePlaceholder')}
          value={name}
          onChange={(e) => {
            nameLockedRef.current = true;
            setName(e.target.value);
          }}
          className="mt-4 w-full rounded-input border-[1.5px] border-solid border-ink bg-canvas px-8 py-3 font-dm-sans font-medium text-base text-ink outline-none placeholder:text-ink/40"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => selectCategory(cat)}
              className={`min-h-11 rounded-pill px-4 font-dm-sans font-medium text-body-sm leading-body-sm ${
                category === cat ? 'bg-ember text-obsidian' : 'bg-canvas text-ink'
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>

        <p className="mt-4 font-system text-caption leading-caption text-ink">{t('upload.colors')}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESET_COLOR_KEYS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => toggleColor(color)}
              className={`min-h-11 rounded-pill px-3 font-dm-sans font-medium text-caption leading-caption ${
                colors.includes(color) ? 'bg-ember text-obsidian' : 'bg-canvas text-ink'
              }`}
            >
              {colorLabel(color)}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 font-dm-sans font-medium text-body-sm leading-body-sm text-ember" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6">
          <Button className="w-full" onClick={handleSubmit} disabled={!file || !name.trim() || !category || saving}>
            {saving ? t('upload.saving') : t('upload.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
