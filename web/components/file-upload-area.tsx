"use client";

import { useRef } from "react";
import { Upload, X, File, Image, Video, Music, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import { Label } from "./ui/label";

interface FileUploadAreaProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  maxFileSize: number;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return <Image className="w-8 h-8" />;
  if (mimeType.startsWith('video/')) return <Video className="w-8 h-8" />;
  if (mimeType.startsWith('audio/')) return <Music className="w-8 h-8" />;
  if (mimeType.includes('text') || mimeType.includes('pdf') || mimeType.includes('document')) {
    return <FileText className="w-8 h-8" />;
  }
  return <File className="w-8 h-8" />;
}

function getFileTypeLabel(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Imagem';
  if (mimeType.startsWith('video/')) return 'Vídeo';
  if (mimeType.startsWith('audio/')) return 'Áudio';
  if (mimeType.includes('text') || mimeType.includes('pdf') || mimeType.includes('document')) {
    return 'Documento';
  }
  return 'Arquivo';
}

export function FileUploadArea({
  file,
  onFileSelect,
  onFileRemove,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onPaste,
  maxFileSize
}: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  }

  function handleClick() {
    fileInputRef.current?.click();
  }

  if (file) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="text-muted-foreground">
              {getFileIcon(file.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate max-w-[150px] sm:max-w-xs md:max-w-sm lg:max-w-md">{file.name}</p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{getFileTypeLabel(file.type)}</span>
                <span>•</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onFileRemove}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            Arquivo selecionado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">
        Selecionar arquivo
      </Label>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onPaste={onPaste}
        onClick={handleClick}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          onChange={handleFileInputChange}
          accept="*/*"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={`
            p-3 rounded-full transition-colors
            ${isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
          `}>
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">
              {isDragOver ? 'Solte o arquivo aqui' : 'Clique para selecionar ou arraste um arquivo'}
            </h3>
          </div>

          <div className="text-xs text-muted-foreground">
            Tamanho máximo: {formatFileSize(maxFileSize)}
          </div>
        </div>
      </div>
    </div>
  );
}