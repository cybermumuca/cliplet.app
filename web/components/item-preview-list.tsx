"use client";

import { CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemPreview } from "./item-preview";
import { useRouter } from "next/navigation";

interface ClipboardItem {
  id: string;
  type: "text" | "file" | "image";
  content: string;
  filename?: string;
  timestamp: string;
}

const mockItems: ClipboardItem[] = [
  {
    id: "1",
    type: "text",
    content: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: "2",
    type: "text",
    content: "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  },
  {
    id: "3",
    type: "file",
    content: "https://example.com/documento.pdf",
    filename: "documento.pdf",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: "4",
    type: "image",
    content: "https://example.com/imagem.png",
    filename: "imagem.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
]

export function ItemPreviewList() {
  if (mockItems.length === 0) {
    return <NoDataPlaceholder />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {mockItems.map((item) => <ItemPreview key={item.id} item={item} />)}
    </div>
  );
}

function NoDataPlaceholder() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <CopyIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Nenhum item ainda</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Comece adicionando textos, arquivos ou imagens para compartilhar entre seus dispositivos.
      </p>
      <Button onClick={() => router.push("/add")} className="w-full sm:w-auto">
        Adicionar item
      </Button>
    </div>
  );
}