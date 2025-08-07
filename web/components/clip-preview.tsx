"use client";

import { FileIcon, FileTextIcon, ImageIcon, CopyIcon, ClipboardIcon, ClapperboardIcon, HeadphonesIcon, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Clip } from "./clip";
import { formatTimestamp } from "@/lib/utils";
import { type ClipItem, type ClipTypes } from "@/types/clip";

function getClipIcon(type: ClipTypes) {
  switch (type) {
    case 'text':
      return <ClipboardIcon className="h-8 w-8" />;
    case "image":
      return <ImageIcon className="h-8 w-8" />;
    case "video":
      return <ClapperboardIcon className="h-8 w-8" />;
    case "audio":
      return <HeadphonesIcon className="h-8 w-8" />;
    case "document":
      return <FileTextIcon className="h-8 w-8" />;
    case "file":
      return <FileIcon className="h-8 w-8" />;
  }
}

async function copyToClipboard(content: string) {
  try {
    await navigator.clipboard.writeText(content);
    toast.success("Copiado para a área de transferência!");
  } catch (err) {
    console.error("Falha ao copiar:", err);
    toast.error("Não foi possível copiar para a área de transferência.");
  }
}

async function downloadFile(url: string, filename: string) {
  try {
    const response = await fetch(url, {
      credentials: "omit",
      headers: {}
    });
    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    toast.success("Download iniciado!");
  } catch (err) {
    console.error("Falha ao fazer download:", err);
    toast.error("Não foi possível fazer o download do arquivo.");
  }
}

interface ClipPreviewProps {
  clip: ClipItem;
}

export function ClipPreview({ clip }: ClipPreviewProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  function renderPreview() {
    switch (clip.type) {
      case 'text':
        return (
          <div className="flex items-start justify-center h-full p-4">
            <pre className="text-sm text-start whitespace-pre-wrap break-words text-muted-foreground max-h-32 overflow-auto w-full bg-background/70 rounded-md p-2 border border-muted">
              {clip.content.length > 200
                ? clip.content.slice(0, 200) + "…"
                : clip.content}
            </pre>
          </div>
        );
      case 'image':
        return (
          <div className="relative h-full">
            <img
              src={clip.content}
              alt={clip.fileName || "Imagem"}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `
                  <div class=\"flex items-center justify-center h-full text-muted-foreground\">
                    <svg class=\"h-12 w-12\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                      <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\"></path>
                    </svg>
                  </div>
                `;
              }}
            />
          </div>
        );
      case 'video':
        return (
          <div className="relative h-full flex items-center justify-center">
            <video
              src={clip.content}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-lg bg-black"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            >
              Seu navegador não suporta o elemento <code>video</code>.
            </video>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            {getClipIcon(clip.type)}
            <p className="text-xs mt-2 text-center break-all px-2">
              {clip.fileName || 'Arquivo'}
            </p>
          </div>
        );
    }
  }

  function handleItemClick(e: React.MouseEvent) {
    // Evita abrir o modal se clicou no botão de copiar do overlay
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsDetailOpen(true);
  }

  return (
    <>
      <div
        className="group relative aspect-square bg-background/60 backdrop-blur-sm border border-muted rounded-lg overflow-hidden hover:border-border transition-all duration-200 hover:shadow-md cursor-pointer"
        onClick={handleItemClick}
      >
        {/* Preview Content */}
        <div className="h-full">
          {renderPreview()}
        </div>

        {/* Overlay com informações */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={(e) => {
                e.stopPropagation();

                if (clip.type === 'text') {
                  copyToClipboard(clip.content);

                  return;
                }

                downloadFile(clip.content, clip.fileName || 'arquivo');
              }}
            >
              {clip.type === "text" ? <CopyIcon className="h-4 w-4" /> : <DownloadIcon className="h-4 w-4" />}
            </Button>
          </div>

          <div className="text-white">
            <p className="text-xs font-medium truncate">
              {clip.fileName || (clip.type === 'text' ? 'Texto' : 'Item')}
            </p>
            <p className="text-xs opacity-80">
              {formatTimestamp(clip.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <Clip
        clipId={clip.id}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  );
}