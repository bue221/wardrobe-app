import { useState, useRef, type ChangeEvent } from 'react';
import type { Category } from '../types';
import { CATEGORIES } from '../types';

const PRESET_COLORS = [
  'Negro',
  'Blanco',
  'Gris',
  'Azul',
  'Rojo',
  'Verde',
  'Amarillo',
  'Rosa',
  'Marrón',
  'Beige',
];

interface UploadFormProps {
  onAdd: (file: File, name: string, category: Category, colors: string[]) => Promise<void>;
  onClose: () => void;
}

export function UploadForm({ onAdd, onClose }: UploadFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('top');
  const [colors, setColors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Elegí un archivo de imagen válido');
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function toggleColor(color: string) {
    setColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  }

  async function handleSubmit() {
    if (!file || !name.trim()) {
      setError('Foto y nombre son obligatorios');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onAdd(file, name.trim(), category, colors);
      onClose();
    } catch (err) {
      console.error('Failed to save clothing item', err);
      setError('No se pudo guardar la prenda. Probá de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-obsidian/60 z-40 flex items-end md:items-center justify-center p-0 md:p-4">
      <div
        className="bg-pumice rounded-t-[40px] md:rounded-[40px] w-full md:max-w-md p-6 space-y-4 max-h-[90dvh] overflow-y-auto"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-title"
      >
        <div className="flex justify-between items-center">
          <h2 id="upload-title" className="font-display text-[32px] leading-none tracking-[0.64px] text-obsidian">
            AGREGAR
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-limestone text-obsidian hover:bg-ember transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-[4/3] bg-limestone rounded-[40px] flex items-center justify-center overflow-hidden hover:brightness-[0.98] transition-[filter]"
        >
          {preview ? (
            <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center space-y-2 px-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-ember" aria-hidden="true" />
              <p className="font-body text-body-sm text-obsidian/70">Toca para elegir foto</p>
            </div>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <input
          type="text"
          placeholder="Nombre (ej: Remera blanca básica)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-2 rounded-[800px] font-body text-body-sm transition-colors ${
                category === cat.value
                  ? 'bg-ember text-obsidian'
                  : 'bg-limestone text-obsidian hover:bg-obsidian/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div>
          <p className="font-caption text-obsidian/55 mb-2">Colores (opcional)</p>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => toggleColor(color)}
                className={`px-3 py-1.5 rounded-[800px] font-body text-[12px] transition-colors ${
                  colors.includes(color)
                    ? 'bg-sulfur text-obsidian'
                    : 'bg-limestone text-obsidian/70 hover:bg-obsidian/5'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="font-body text-body-sm text-ember" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!file || !name.trim() || saving}
          className="btn-primary w-full"
        >
          {saving ? 'Guardando...' : 'Guardar prenda'}
        </button>
      </div>
    </div>
  );
}
