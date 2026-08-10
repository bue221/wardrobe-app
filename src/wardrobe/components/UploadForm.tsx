import { useState, useRef, type ChangeEvent } from 'react';
import type { Category } from '../types';
import { CATEGORIES } from '../types';

const PRESET_COLORS = ['Negro', 'Blanco', 'Gris', 'Azul', 'Rojo', 'Verde', 'Amarillo', 'Rosa', 'Marrón', 'Beige'];

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
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function toggleColor(color: string) {
    setColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  }

  async function handleSubmit() {
    if (!file || !name.trim()) return;
    setSaving(true);
    try {
      await onAdd(file, name.trim(), category, colors);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-slate-900 rounded-t-3xl md:rounded-3xl w-full md:max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg">Agregar prenda</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Image picker */}
        <div
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-[3/2] bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-700 transition-colors"
        >
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-slate-500 text-center">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm">Toca para elegir foto</p>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Name */}
        <input
          type="text"
          placeholder="Nombre (ej: Remera blanca básica)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-violet-500"
        />

        {/* Category */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                category === cat.value
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Colors */}
        <div>
          <p className="text-slate-400 text-xs mb-2">Colores (opcional)</p>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={`px-2 py-1 rounded-full text-xs transition-colors ${
                  colors.includes(color)
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!file || !name.trim() || saving}
          className="w-full py-3 bg-violet-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-violet-500 transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar prenda'}
        </button>
      </div>
    </div>
  );
}
