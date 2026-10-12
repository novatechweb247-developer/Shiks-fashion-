import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { uploadMedia, useResolvedMedia } from '../services/mediaService';

interface ImageUploaderProps {
  label: string;
  currentImage: string;
  onImageChange: (newImage: string) => void;
  aspectRatio?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  currentImage,
  onImageChange,
  aspectRatio = 'aspect-[4/3]'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(currentImage);

  // Automatically resolves `media:media_id` into viewable DataURL/StorageURL
  const displayImage = useResolvedMedia(currentImage);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setUploadError(null);
    setIsProcessing(true);
    try {
      // Offloads image to Cloud Storage or dedicated /media Firestore doc with bounded timeout
      const mediaRef = await uploadMedia(file);
      onImageChange(mediaRef);
      setUrlInput(mediaRef);
    } catch (err: any) {
      console.error('[ImageUploader] Upload error:', err);
      setUploadError('Image processing encountered an issue. Local preview retained.');
    } finally {
      setIsProcessing(false);
      // Reset input value so selecting the same file again triggers onChange
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlBlur = () => {
    if (urlInput.trim() !== currentImage) {
      onImageChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-3 p-4 bg-white border border-[#5A1833]/15 rounded-sm">
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A1833]">
        {label}
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Thumbnail Preview */}
        <div className={`sm:col-span-4 relative ${aspectRatio} bg-black/5 overflow-hidden border border-[#5A1833]/20`}>
          {displayImage ? (
            <img
              src={displayImage}
              alt={label}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-400">
              <ImageIcon className="w-6 h-6 mb-1 text-gray-400" />
              <span>No image</span>
            </div>
          )}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#C9A45C]" />
              <span>Optimizing...</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="sm:col-span-8 space-y-3">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#431225] transition-colors inline-flex items-center gap-2 disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9A45C]" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>Upload New Image</span>
                </>
              )}
            </button>

            {uploadError && (
              <p className="text-[11px] text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <span>{uploadError}</span>
              </p>
            )}

            <p className="text-[11px] text-[#191719]/60 mt-1">
              Supports JPG, PNG, WebP. Automatically optimized and saved in standalone storage to prevent document limits.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#191719]/70 mb-1">
              Or Image URL / Path:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="/src/assets/images/... or https://..."
                className="flex-1 px-3 py-1.5 text-xs bg-[#F8F4EE] border border-[#5A1833]/20 focus:outline-none focus:border-[#5A1833]"
              />
              <button
                type="button"
                onClick={handleUrlBlur}
                className="px-3 py-1.5 bg-[#C9A45C] text-[#5A1833] text-xs font-semibold"
                title="Apply URL"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
