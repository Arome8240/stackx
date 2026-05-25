'use client';

import * as React from 'react';
import { Upload, X, ImageIcon, FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  maxSizeMb?: number;
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
  className?: string;
  label?: string;
  hint?: string;
}

export function FileUpload({
  accept = 'image/*',
  maxSizeMb = 10,
  multiple = false,
  onFiles,
  className,
  label = 'Drop files here or click to upload',
  hint,
}: FileUploadProps) {
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function validate(files: FileList | null): File[] {
    if (!files) return [];
    const maxBytes = maxSizeMb * 1024 * 1024;
    const valid: File[] = [];
    for (const file of Array.from(files)) {
      if (file.size > maxBytes) {
        setError(`${file.name} exceeds ${maxSizeMb}MB limit`);
        return [];
      }
      valid.push(file);
    }
    setError(null);
    return valid;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = validate(e.target.files);
    if (files.length) onFiles?.(files);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const files = validate(e.dataTransfer.files);
    if (files.length) onFiles?.(files);
  }

  return (
    <div className={className}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
          dragging ? 'border-violet-500 bg-violet-500/5' : 'border-border/60 hover:border-violet-500/50 hover:bg-white/[0.02]',
        )}
      >
        <Upload className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm text-foreground font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        <p className="text-xs text-muted-foreground">Max {maxSizeMb}MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="sr-only"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
