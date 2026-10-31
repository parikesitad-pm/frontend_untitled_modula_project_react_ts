import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Trash2, RefreshCw, Link as LinkIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BannerUploaderProps {
  bannerUrl?: string | null;
  onBannerChange: (url: string | null) => void;
  className?: string;
}

// Preset banner options suitable for the QUEICE / MODULA aesthetic
const PRESET_BANNERS = [
  {
    name: 'Crimson Tech',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Dark Steel Grid',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Deep Obsidian',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Modern Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
  },
];

/**
 * Utility to compress and resize an image before setting it as banner base64 DataURL
 */
const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const maxWidth = 1600;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Output compressed JPEG
        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressed);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const BannerUploader: React.FC<BannerUploaderProps> = ({
  bannerUrl,
  onBannerChange,
  className,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const compressedDataUrl = await compressImageFile(file);
      onBannerChange(compressedDataUrl);
    } catch (err) {
      console.error('Banner compression error:', err);
      setErrorMessage('Failed to process image file. Please try another image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onBannerChange(customUrl.trim());
    setCustomUrl('');
    setShowUrlInput(false);
    setErrorMessage(null);
  };

  const handleRemove = () => {
    onBannerChange(null);
    setErrorMessage(null);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp, image/gif"
        className="hidden"
      />

      {bannerUrl ? (
        <div className="relative group rounded-xl overflow-hidden border border-line bg-canvas aspect-[21/9] sm:aspect-[3/1] max-h-48 shadow-md">
          <img
            src={bannerUrl}
            alt="Assessment Banner Preview"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 p-4 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-raised border border-line hover:bg-canvas text-xs font-mono font-medium text-ink transition-colors shadow cursor-pointer"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', isUploading && 'animate-spin')} />
              <span>Replace Banner</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/80 border border-red-500/40 hover:bg-red-900/90 text-xs font-mono font-medium text-red-200 transition-colors shadow cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-line rounded-xl p-5 bg-surface/40 hover:bg-surface/80 transition-colors text-center space-y-3">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-canvas border border-line flex items-center justify-center text-muted">
              <ImageIcon className="w-5 h-5 text-accent" />
            </div>
            <div className="font-mono text-xs font-semibold text-ink">
              Assessment Banner / Header Image
            </div>
            <div className="text-[11px] text-muted max-w-sm">
              Add an optional wide header banner for your assessment builder & settings.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-xs font-mono font-semibold text-on-accent transition-colors cursor-pointer shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Compressing...' : 'Upload Image'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-line bg-raised hover:bg-line text-xs font-mono text-ink-soft hover:text-ink transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Image URL</span>
            </button>
          </div>

          {/* Quick presets */}
          <div className="pt-2 border-t border-line/40">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-muted mb-2">
              <Sparkles className="w-3 h-3 text-accent-text" />
              <span>Or choose a MODULA preset:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PRESET_BANNERS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onBannerChange(preset.url)}
                  className="px-2.5 py-1 rounded border border-line bg-canvas hover:border-accent text-[11px] font-mono text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* URL Input Form */}
      {showUrlInput && (
        <form onSubmit={handleApplyCustomUrl} className="flex gap-2 pt-1">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/banner-image.jpg"
            className="flex-1 bg-canvas border border-line rounded px-3 py-1.5 text-xs text-ink placeholder-muted focus:outline-none focus:ring-1 focus:ring-accent font-mono"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded bg-accent text-xs font-mono font-medium text-on-accent hover:bg-accent-hover transition-colors cursor-pointer"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="px-2.5 py-1.5 rounded border border-line text-xs font-mono text-muted hover:text-ink transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="text-xs font-mono text-red-400 bg-red-950/30 p-2 rounded border border-red-500/30 text-left">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

