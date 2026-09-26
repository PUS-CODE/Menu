'use client';

import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  fallbackText?: string;
}

export const ImageUploader: React.FC<Props> = ({
  label = 'Image',
  value,
  onChange,
  fallbackText = 'Image Preview',
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>(value.startsWith('data:') ? 'upload' : 'url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size is too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 text-xs">
      {label && <label className="block font-bold text-stone-800">{label}</label>}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200/80 w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mode === 'upload'
              ? 'bg-white text-amber-800 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mode === 'url'
              ? 'bg-white text-amber-800 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Paste Image URL</span>
        </button>
      </div>

      {/* Input Area */}
      {mode === 'upload' ? (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          />

          <div className="flex items-center gap-3">
            <label
              htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
              className="flex-1 border-2 border-dashed border-stone-300 hover:border-amber-500 bg-stone-50 hover:bg-amber-50/50 p-3 rounded-xl cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-1 text-stone-600"
            >
              <Upload className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-stone-800">
                Choose Image File from Storage
              </span>
              <span className="text-[10px] text-stone-400">
                JPG, PNG, WEBP, GIF up to 5MB
              </span>
            </label>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="url"
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
          />
        </div>
      )}

      {/* Live Preview Bar */}
      {value && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-stone-200 border border-stone-300 shrink-0">
              <ImageWithFallback
                src={value}
                alt="Upload preview"
                fill
                className="object-cover"
                fallbackText={fallbackText}
              />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                Image Selected
              </span>
              <p className="text-[10px] text-stone-400 truncate max-w-[200px]">
                {value.startsWith('data:') ? 'Local file uploaded' : value}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-200/60 transition-colors"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
