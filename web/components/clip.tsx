import { FileIcon, FileTextIcon, ImageIcon, CopyIcon, DownloadIcon, ClipboardIcon, ClapperboardIcon, HeadphonesIcon, TrashIcon } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ClipTypes, Clip, FileClip, TextClip, DocumentClip, AudioClip, VideoClip, ImageClip } from "@/types/clip";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatTimestamp } from "@/lib/utils";
import { useState } from "react";
import { ClipSkeleton, ClipButtonsSkeleton, ClipHeaderSkeleton } from "./clip-skeleton";
import { ClipError } from "./clip-error";

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

async function downloadFile(clipId: string, filename: string) {
  try {
    const response = await fetch(`/api/clips/${clipId}/download`);
    if (!response.ok) throw new Error("Erro ao baixar arquivo");

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
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: clip, isLoading, error } = useQuery({
    queryKey: ['clip', clipId],
    queryFn: () => fetchClip(clipId),
    staleTime: 1000 * 60 * 60, // 1 hora
    refetchInterval: 1000 * 60 * 40, // 40 minutos
    enabled: isOpen,
  })

  function renderDetailedContent() {
    if (!clip) return null;

    switch (clip.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-wrap break-words">
                {clip.content.length > 300
                  ? clip.content.slice(0, 300) + "…"
                  : clip.content}
              </p>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4">
            <div className={`aspect-square bg-muted rounded-lg overflow-hidden ${isMobile && "h-64 w-full"}`}>
              <img
                src={clip.content}
                alt={'metadata' in clip ? clip.metadata.fileName || "Imagem" : "Imagem"}
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
              {'metadata' in clip ? clip.metadata.fileName : 'Imagem'}
            </p>
          </div>
        );
      case 'video':
        return (
          <div className="space-y-4">
            <div className={`aspect-video bg-muted rounded-lg overflow-hidden ${isMobile && "h-64 w-full"}`}>
              <video
                src={clip.content}
                controls
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {'metadata' in clip ? clip.metadata.fileName : 'Vídeo'}
            </p>
          </div>
        );
      case 'audio':
        return (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="p-6 bg-muted rounded-md">
                {getClipIcon(clip.type)}
              </div>
            </div>
            <audio src={clip.content} controls className="w-full" />
            <div>
              <p className="font-medium">
                {'metadata' in clip ? clip.metadata.fileName : 'Áudio'}
              </p>
              {'metadata' in clip && 'duration' in clip.metadata && (
                <p className="text-sm text-muted-foreground">
                  Duração: {Math.round(clip.metadata.duration)}s
                </p>
              )}
            </div>
          </div>
        );
      case 'document':
      case 'file':
        return (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="p-6 bg-muted rounded-md">
                {getClipIcon(clip.type)}
              </div>
            </div>
            <div>
              <p className="font-medium">
                {'metadata' in clip ? clip.metadata.fileName : 'Arquivo'}
              </p>
              {'metadata' in clip && 'size' in clip.metadata && (
                <p className="text-sm text-muted-foreground">
                  {clip.type === 'document' ? 'Documento' : 'Arquivo'} • {(clip.metadata.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
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
    if (!clip) return;
    copyToClipboard(clip.content);
    onOpenChange(false);
  }

  async function handleDeleteClip() {
    if (!clip) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/clips/${clip.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete clip');
      }

      // Invalidate queries to refresh the clips list
      queryClient.refetchQueries({ queryKey: ['clips'] });

      toast.success("Clip deletado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting clip:", error);
      toast.error("Não foi possível deletar o clip.");
    } finally {
      setIsDeleting(false);
    }
  }

  function getClipDisplayName(): string {
    if (!clip) return 'Clip não encontrado';
    if (clip.type === 'text') return 'Texto';
    return 'metadata' in clip ? clip.metadata.fileName : 'Arquivo';
  }

  function getClipTypeDisplayName(): string {
    if (!clip) return '';
    const typeMap = {
      text: 'Texto',
      image: 'Imagem',
      video: 'Vídeo',
      audio: 'Áudio',
      document: 'Documento',
      file: 'Arquivo'
    };
    return typeMap[clip.type];
  }

  function ClipContent() {
    if (!clip) return null;

    function formatDuration(duration: number): string {
      if (isNaN(duration) || duration < 0) return "—";
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    return (
      <div className="space-y-6">
        {renderDetailedContent()}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Tipo:</span>
            <span>{getClipTypeDisplayName()}</span>
          </div>
          {clip.type !== 'text' && 'metadata' in clip && 'mimeType' in clip.metadata && clip.metadata.mimeType !== null && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Tipo de arquivo:</span>
              <span>{clip.metadata.mimeType}</span>
            </div>
          )}
          {clip.type !== 'text' && 'metadata' in clip && clip.metadata.size && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Tamanho:</span>
              <span>{(clip.metadata.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )}
          {(clip.type === "image" || clip.type === "video") && 'metadata' in clip && 'width' in clip.metadata && 'height' in clip.metadata && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Dimensões:</span>
              <span>{clip.metadata.width} × {clip.metadata.height}</span>
            </div>
          )}
          {(clip.type === "audio" || clip.type === "video") && 'metadata' in clip && 'duration' in clip.metadata && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Duração:</span>
              <span>{formatDuration(clip.metadata.duration)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Criado:</span>
            <span>
              {new Date(clip.createdAt).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="min-h-[90vh]">
          <DrawerHeader>
            {isLoading ? (
              <ClipHeaderSkeleton isMobile />
            ) : (
              <>
                <DrawerTitle>
                  {getClipDisplayName()}
                </DrawerTitle>
                <DrawerDescription>
                  {getClipTypeDisplayName()}
                </DrawerDescription>
              </>
            )}
          </DrawerHeader>
          <div className="px-4 overflow-y-scroll">
            {isLoading ? (
              <ClipSkeleton isMobile={isMobile} />
            ) : error ? (
              <ClipError clipId={clipId} />
            ) : clip ? (
              <ClipContent />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Clip não encontrado</p>
              </div>
            )}
          </div>
          <DrawerFooter className="space-y-0.5">
            {isLoading ? (
              <ClipButtonsSkeleton />
            ) : clip && !error ? (
              <>
                {clip.type === "text" && (
                  <Button onClick={handleCopyAndClose} className="w-full" size="lg">
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copiar conteúdo
                  </Button>
                )}
                {clip.type !== "text" && 'metadata' in clip && (
                  <Button onClick={(e) => downloadFile(clip.id, clip.metadata.fileName || 'arquivo')} className="w-full" size="lg">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Baixar {getClipTypeDisplayName().toLowerCase()}
                  </Button>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="lg" className="w-full" disabled={isDeleting}>
                      <TrashIcon className="h-4 w-4 mr-2" />
                      {isDeleting ? "Deletando..." : "Deletar clip"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deletar clip</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza de que deseja deletar este clip? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteClip} disabled={isDeleting}>
                        {isDeleting ? "Deletando..." : "Deletar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : null}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          {isLoading ? (
            <ClipHeaderSkeleton />
          ) : (
            <>
              <SheetTitle>
                {getClipDisplayName()}
              </SheetTitle>
              <SheetDescription>
                {getClipTypeDisplayName()}
              </SheetDescription>
            </>
          )}
        </SheetHeader>
        <div className="px-4">
          {isLoading ? (
            <ClipSkeleton isMobile={isMobile} />
          ) : error ? (
            <ClipError clipId={clipId} />
          ) : clip ? (
            <ClipContent />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Clip não encontrado</p>
            </div>
          )}
        </div>
        <SheetFooter className="px-4 space-y-0.5">
          {isLoading ? (
            <ClipButtonsSkeleton />
          ) : clip && !error ? (
            <>
              {clip.type === "text" && (
                <Button onClick={handleCopyAndClose} className="w-full" size="lg">
                  <CopyIcon className="h-4 w-4 mr-2" />
                  Copiar conteúdo
                </Button>
              )}
              {clip.type !== "text" && 'metadata' in clip && (
                <Button onClick={(e) => downloadFile(clip.id, clip.metadata.fileName || 'arquivo')} className="w-full" size="lg">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Baixar {getClipTypeDisplayName().toLowerCase()}
                </Button>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full" disabled={isDeleting}>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    {isDeleting ? "Deletando..." : "Deletar clip"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deletar clip</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza de que deseja deletar este clip? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteClip} disabled={isDeleting}>
                      {isDeleting ? "Deletando..." : "Deletar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
