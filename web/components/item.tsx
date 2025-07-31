import { FileIcon, FileTextIcon, ImageIcon, CopyIcon, DownloadIcon } from "lucide-react";
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

interface ClipboardItem {
  id: string;
  type: "text" | "file" | "image";
  content: string;
  filename?: string;
  timestamp: string;
}

interface ItemProps {
  item: ClipboardItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function getItemIcon(type: string) {
  switch (type) {
    case 'text':
      return <FileTextIcon className="h-8 w-8" />;
    case 'file':
      return <FileIcon className="h-8 w-8" />;
    case 'image':
      return <ImageIcon className="h-8 w-8" />;
    default:
      return <FileTextIcon className="h-8 w-8" />;
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

function formatTimestamp(date: string) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  return `${days}d atrás`;
}

export function Item({ item, isOpen, onOpenChange }: ItemProps) {
  const isMobile = useIsMobile();

  function renderDetailedContent() {
    switch (item.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-wrap break-words">
                {item.content.length > 300
                  ? item.content.slice(0, 300) + "…"
                  : item.content}
              </p>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4">
            <div className={`aspect-square bg-muted rounded-lg overflow-hidden ${isMobile && "h-64 w-full"}`}>
              <img
                src={item.content}
                alt={item.filename || "Imagem"}
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
            {item.filename && (
              <p className="text-sm text-muted-foreground text-center">
                {item.filename}
              </p>
            )}
          </div>
        );
      case 'file':
        return (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="p-6 bg-muted rounded-md">
                {getItemIcon(item.type)}
              </div>
            </div>
            <div>
              <p className="font-medium">{item.filename || 'Arquivo'}</p>
              <p className="text-sm text-muted-foreground">Arquivo</p>
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
    copyToClipboard(item.content);
    onOpenChange(false);
  }

  function ItemContent() {
    return (
      <div className="space-y-6">
        {renderDetailedContent()}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Tipo:</span>
            <span className="capitalize">
              {item.type === 'text' ? 'Texto' : item.type === 'file' ? 'Arquivo' : 'Imagem'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Criado:</span>
            <span>
              {new Date(item.timestamp).toLocaleString("pt-BR", {
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
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {item.filename || (item.type === 'text' ? 'Texto' : item.type === 'file' ? 'Arquivo' : 'Imagem')}
            </DrawerTitle>
            <DrawerDescription>
              Criado {formatTimestamp(item.timestamp)}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-scroll">
            <ItemContent />
          </div>
          <DrawerFooter className="space-y-0.5 mt-2">
            {item.type === "text" && (
              <Button onClick={handleCopyAndClose} className="w-full" size="lg">
                <CopyIcon className="h-4 w-4 mr-2" />
                Copiar conteúdo
              </Button>
            )}
            {item.type === "image" && (
              <Button onClick={handleCopyAndClose} className="w-full" size="lg">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Baixar imagem
              </Button>
            )}
            {item.type === "file" && (
              <Button onClick={handleCopyAndClose} className="w-full" size="lg">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Baixar arquivo
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
          <SheetTitle>
            {item.filename || (item.type === 'text' ? 'Texto' : item.type === 'file' ? 'Arquivo' : 'Imagem')}
          </SheetTitle>
          <SheetDescription>
            Criado {formatTimestamp(item.timestamp)}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <ItemContent />
        </div>
        <SheetFooter className="px-4 space-y-0.5">
          {item.type === "text" && (
            <Button onClick={handleCopyAndClose} className="w-full" size="lg">
              <CopyIcon className="h-4 w-4 mr-2" />
              Copiar conteúdo
            </Button>
          )}
          {item.type === "image" && (
            <Button onClick={handleCopyAndClose} className="w-full" size="lg">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Baixar imagem
            </Button>
          )}
          {item.type === "file" && (
            <Button onClick={handleCopyAndClose} className="w-full" size="lg">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Baixar arquivo
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