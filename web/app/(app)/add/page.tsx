"use client";

import {
  Upload as UploadIcon,
  FileText as FileTextIcon,
  Image as ImageIcon,
  Clipboard as ClipboardIcon
} from "lucide-react";
import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Header } from "@/components/header";
import { toast } from "sonner";
import { formatFileSize } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ItemType = "text" | "file";

// Permitir até 2 MB de texto (~2.097.152 caracteres)
const MAX_TEXT_LENGTH = 2 * 1024 * 1024; // 2 MB em bytes
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function Add() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [type, setType] = useState<ItemType>("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();

    const { clipboardData } = e;

    if (!clipboardData) return;

    const files = Array.from(clipboardData.files);

    if (files.length > 0) {
      const newFile = files[0];

      // Verificar tamanho do arquivo
      if (newFile.size > MAX_FILE_SIZE) {
        toast.error(`Arquivo muito grande. Tamanho máximo: ${formatFileSize(MAX_FILE_SIZE)}`);
        return;
      }

      if (file) {
        const shouldReplace = window.confirm(
          `Já existe um arquivo selecionado (${file.name}). Deseja substituí-lo pelo novo arquivo (${newFile.name})?`
        );

        if (!shouldReplace) {
          return;
        }
      }

      setFile(newFile);
      setType("file");
      toast.success(`${newFile.type.startsWith('image/') ? 'Imagem colada' : 'Arquivo colado'}: ${newFile.name || 'arquivo sem nome'}`);
      return;
    }

    const textData = clipboardData.getData('text');

    if (textData) {
      setText(text.concat(textData));
      setType("text");

      if (type === "file") {
        toast.success("Texto colado com sucesso");
      }

      return;
    }

    toast.error("Conteúdo colado não foi reconhecido");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);

    if (files.length > 0) {
      const droppedFile = files[0];

      if (droppedFile.size > MAX_FILE_SIZE) {
        toast.error(`Arquivo muito grande. Tamanho máximo: ${formatFileSize(MAX_FILE_SIZE)}`);
        return;
      }

      setFile(droppedFile);
      setType("file");
      toast.success(`${droppedFile.type.startsWith('image/') ? 'Imagem' : 'Arquivo'} arrastado: ${droppedFile.name}`);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error(`Arquivo muito grande. Tamanho máximo: ${formatFileSize(MAX_FILE_SIZE)}`);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        return;
      }

      setFile(selectedFile);
      setType("file");
      toast.success(`Arquivo selecionado: ${selectedFile.name}`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsUploading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push("/");
    } catch (error) {
      toast.error("Erro ao salvar item: " + error);
    } finally {
      setIsUploading(false);
    }
  }

  function isValid() {
    switch (type) {
      case "text":
        return text.trim().length > 0 && text.length <= MAX_TEXT_LENGTH;
      case "file":
        return file !== null && file.size <= MAX_FILE_SIZE;
      default:
        return false;
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />

      <main className="flex-1 container px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Título da página */}
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Adicionar Item
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tipo de Item */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Tipo de item</Label>
              <RadioGroup value={type} onValueChange={(value) => setType(value as ItemType)}>

                {/* Texto */}
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/20">
                        <ClipboardIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium leading-4">Texto</h3>
                        <p className="text-muted-foreground text-xs md:text-sm">
                          Colar ou digitar qualquer texto.
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>

                {/* Arquivos */}
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="file" id="file" />
                  <Label htmlFor="file" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/20">
                        <UploadIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-medium leading-4">Arquivo</h3>
                        <p className="text-muted-foreground text-xs md:text-sm">
                          Colar ou fazer upload de mídia.
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Conteúdo baseado no tipo */}
            <div className="space-y-4">
              {type === "text" && (
                <div className="space-y-4">
                  <Label htmlFor="text-content" className="text-base">
                    Conteúdo do texto
                  </Label>

                  <Textarea
                    id="text-content"
                    ref={textareaRef}
                    placeholder="Digite ou cole seu texto aqui"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[200px] resize-y"
                    onPaste={handlePaste}
                  />

                  <span
                    className={`flex justify-between text-sm ${text.length >= MAX_TEXT_LENGTH
                      ? "text-red-600 dark:text-red-400"
                      : text.length >= MAX_TEXT_LENGTH * 0.9
                        ? "text-yellow-700 dark:text-yellow-400"
                        : "text-muted-foreground"
                      }`}
                  >
                    {text.length} caracteres
                  </span>
                </div>
              )}

              {type === "file" && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Selecionar arquivo
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    Tamanho máximo: {formatFileSize(MAX_FILE_SIZE)}
                  </p>

                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-border hover:border-border/80'
                      }`}
                    onPaste={handlePaste}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {file ? (
                      <div className="space-y-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent mx-auto">
                          {file.type.startsWith('image/') ? (
                            <ImageIcon className="h-6 w-6" />
                          ) : (
                            <FileTextIcon className="h-6 w-6" />
                          )}
                        </div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {file.type || 'Tipo desconhecido'}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          Remover arquivo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadIcon className={`h-8 w-8 mx-auto ${isDragOver ? 'text-blue-600' : 'text-muted-foreground'}`} />
                        <p className={`text-sm ${isDragOver ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`}>
                          {isDragOver
                            ? 'Solte o arquivo aqui...'
                            : 'Clique para selecionar, arraste um arquivo aqui ou cole uma imagem'
                          }
                        </p>
                        {!isDragOver && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Escolher arquivo
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="*/*"
                  />
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                className="sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!isValid() || isUploading}
                className="sm:flex-1"
              >
                {isUploading ? "Salvando..." : "Salvar Item"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}