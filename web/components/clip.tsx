import { FileIcon, FileTextIcon, ImageIcon, CopyIcon, DownloadIcon, ClipboardIcon, ClapperboardIcon, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ClipTypes, Clip, FileClip, TextClip, DocumentClip, AudioClip, VideoClip, ImageClip } from "@/types/clip";
import { useQuery } from "@tanstack/react-query";
import { formatTimestamp } from "@/lib/utils";

interface ClipProps {
  clipId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

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

async function fetchClip(clipId: string): Promise<TextClip | ImageClip | VideoClip | AudioClip | DocumentClip | FileClip> {
  const response = await fetch(`/api/clips/${clipId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch clip");
  }

  return await response.json();
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

export function Clip({ clipId, isOpen, onOpenChange }: ClipProps) {
  const isMobile = useIsMobile();

  const { data: clip, isLoading, error } = useQuery({
    queryKey: ['clip', clipId],
    queryFn: () => fetchClip(clipId),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Erro ao carregar clip</p>
      </div>
    );
  }

  if (!clip) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Clip não encontrado</p>
      </div>
    );
  }

  function renderDetailedContent() {
    switch (clip!.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-wrap break-words">
                {clip!.content.length > 300
                  ? clip!.content.slice(0, 300) + "…"
                  : clip!.content}
              </p>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4">
            <div className={`aspect-square bg-muted rounded-lg overflow-hidden ${isMobile && "h-64 w-full"}`}>
              <img
                src={clip!.content}
                alt={clip!.metadata.fileName || "Imagem"}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="flex items-center justify-center h-full text-muted-foreground">
                      <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                `;
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {clip!.metadata.fileName}
            </p>
          </div>
        );
      case 'video':
        return (
          <div className="space-y-4">
            <div className={`aspect-video bg-muted rounded-lg overflow-hidden ${isMobile && "h-64 w-full"}`}>
              <video
                src={clip!.content}
                controls
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {clip!.metadata.fileName}
            </p>
          </div>
        );
      case 'audio':
        return (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="p-6 bg-muted rounded-md">
                {getClipIcon(clip!.type)}
              </div>
            </div>
            <audio src={clip!.content} controls className="w-full" />
            <div>
              <p className="font-medium">{clip!.metadata.fileName}</p>
              <p className="text-sm text-muted-foreground">
                Duração: {Math.round(clip!.metadata.duration)}s
              </p>
            </div>
          </div>
        );
      case 'document':
      case 'file':
        return (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="p-6 bg-muted rounded-md">
                {getClipIcon(clip!.type)}
              </div>
            </div>
            <div>
              <p className="font-medium">{clip!.metadata.fileName}</p>
              <p className="text-sm text-muted-foreground">
                {clip!.type === 'document' ? 'Documento' : 'Arquivo'} • {(clip!.metadata.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <p className="text-muted-foreground">Conteúdo não disponível</p>
          </div>
        );
    }
  }

  function handleCopyAndClose() {
    copyToClipboard(clip!.content);
    onOpenChange(false);
  }

  function getClipDisplayName(): string {
    if (clip!.type === 'text') return 'Texto';
    return clip!.metadata.fileName;
  }

  function getClipTypeDisplayName(): string {
    const typeMap = {
      text: 'Texto',
      image: 'Imagem',
      video: 'Vídeo',
      audio: 'Áudio',
      document: 'Documento',
      file: 'Arquivo'
    };
    return typeMap[clip!.type];
  }

  function ClipContent() {
    return (
      <div className="space-y-6">
        {renderDetailedContent()}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Tipo:</span>
            <span>{getClipTypeDisplayName()}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Criado:</span>
            <span>
              {new Date(clip!.createdAt).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
          {clip!.type !== 'text' && clip!.metadata.size && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Tamanho:</span>
              <span>{(clip!.metadata.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{getClipDisplayName()}</DrawerTitle>
            <DrawerDescription>
              Criado {formatTimestamp(clip.createdAt)}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-scroll">
            <ClipContent />
          </div>
          <DrawerFooter className="space-y-0.5 mt-2">
            {clip.type === "text" && (
              <Button onClick={handleCopyAndClose} className="w-full" size="lg">
                <CopyIcon className="h-4 w-4 mr-2" />
                Copiar conteúdo
              </Button>
            )}
            {clip.type !== "text" && (
              <Button onClick={(e) => downloadFile(clip.content, clip.metadata.fileName || 'arquivo')} className="w-full" size="lg">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Baixar {getClipTypeDisplayName().toLowerCase()}
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline" size="lg">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{getClipDisplayName()}</SheetTitle>
          <SheetDescription>
            Criado {formatTimestamp(clip.createdAt)}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <ClipContent />
        </div>
        <SheetFooter className="px-4 space-y-0.5">
          {clip.type === "text" && (
            <Button onClick={handleCopyAndClose} className="w-full" size="lg">
              <CopyIcon className="h-4 w-4 mr-2" />
              Copiar conteúdo
            </Button>
          )}
          {clip.type !== "text" && (
            <Button onClick={(e) => downloadFile(clip.content, clip.metadata.fileName || 'arquivo')} className="w-full" size="lg">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Baixar {getClipTypeDisplayName().toLowerCase()}
            </Button>
          )}
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}