"use client";

import { useCallback, useState } from "react";
import { auth } from "@/lib/firebase";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onCaptionChange?: (caption: string) => void;
  caption?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

interface UploadResponse {
  success?: boolean;
  url?: string;
  error?: string;
}

export default function ImageUpload({ value, onChange, onCaptionChange, caption }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    if (!ALLOWED_TYPES.has(file.type)) {
      setError("Unsupported image format. Use JPG, PNG, WebP, or GIF.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    setUploading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Your session has expired. Please sign in again before uploading an image.");

      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/upload-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${await user.getIdToken()}` },
        body: formData,
      });
      const responseText = await response.text();

      let data: UploadResponse;
      try {
        data = JSON.parse(responseText) as UploadResponse;
      } catch {
        throw new Error("Image upload service returned an invalid response. Please try again.");
      }

      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.error || "Image upload failed. Please try again.");
      }

      onChange(data.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
    event.target.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!uploading) {
      const file = event.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    }
  }

  function handleRemove() {
    setError(null);
    onChange("");
    onCaptionChange?.("");
  }

  return (
    <div>
      {!value ? (
        <div onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} className="border-2 border-dashed border-[#e5e5e5] rounded p-8 text-center hover:border-[#c0392b] transition-colors">
          <input id="image-upload" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleInputChange} disabled={uploading} className="hidden" />
          <label htmlFor="image-upload" className="cursor-pointer block">
            {uploading ? (
              <>
                <div className="flex justify-center mb-3"><div className="w-6 h-6 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin" /></div>
                <p className="text-sm text-[#444] font-medium">Uploading image...</p>
                <p className="text-xs text-[#888] mt-1">Uploading securely...</p>
              </>
            ) : (
              <>
                <p className="text-sm text-[#444] font-medium">Drop an image here or click to upload</p>
                <p className="text-xs text-[#888] mt-1">JPG, PNG, WebP, GIF — max 10 MB</p>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="border border-[#e5e5e5] rounded overflow-hidden bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Featured image preview" className="w-full max-h-96 object-cover" />
          <div className="p-3 flex items-center justify-between bg-[#f7f6f4]">
            <span className="text-xs text-[#888] truncate flex-1 mr-4" title={value}>{value}</span>
            <button type="button" onClick={handleRemove} disabled={uploading} className="text-xs text-red-600 hover:underline disabled:opacity-50">Remove</button>
          </div>
        </div>
      )}

      {error && <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 text-xs text-red-700" role="alert">{error}</div>}

      {value && onCaptionChange && (
        <div className="mt-3">
          <label htmlFor="image-caption" className="block text-xs font-medium text-[#444] mb-1">Image caption (optional)</label>
          <input id="image-caption" type="text" value={caption ?? ""} onChange={(event) => onCaptionChange(event.target.value)} placeholder="Describe the image for accessibility..." className="w-full px-3 py-2 border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#c0392b]" />
        </div>
      )}
    </div>
  );
}
