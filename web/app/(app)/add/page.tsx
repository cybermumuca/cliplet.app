"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { formatFileSize } from "@/lib/utils";

import { useFileUpload } from "@/hooks/use-file-upload";
import { useTextSave } from "@/hooks/use-text-save";
import { useClipboard } from "@/hooks/use-clipboard";
import { FileUploadArea } from "@/components/file-upload-area";
import { TypeSelector } from "@/components/type-selector";
import { queryClient } from "@/lib/react-query";

type ClipType = "text" | "file";

const MAX_TEXT_LENGTH = 2 * 1024 * 1024; // 2 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function Add() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [type, setType] = useState<ClipType>("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { mutateAsync: uploadFile, isPending: fileIsUploading } = useFileUpload();
  const { mutateAsync: saveText, isPending: textIsSaving } = useTextSave();
  const { isDragOver, setIsDragOver, detectClipType, handlePaste, handleDrop } = useClipboard();

  const isUploading = fileIsUploading || textIsSaving;

  function handleFileSelect(selectedFile: File) {
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(`Arquivo muito grande. Tamanho máximo: ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }

    setFile(selectedFile);
    setType("file");
    toast.success(`Arquivo selecionado: ${selectedFile.name}`);
  }

  function handleTextPaste(pastedText: string) {
    setText(prev => prev.concat(pastedText));
    setType("text");
    if (type === "file") {
      toast.success("Texto colado com sucesso");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (type === "text") {
      await saveText(text);
    } else if (type === "file" && file) {
      await uploadFile({ file, detectClipType });
    }

    await queryClient.refetchQueries({ queryKey: ['clips'] });

    router.push("/");
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
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Adicionar Clip
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <TypeSelector type={type} onTypeChange={setType} />

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
                    onPaste={(e) => handlePaste(e, handleFileSelect, handleTextPaste, file)}
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
                <FileUploadArea
                  file={file}
                  onFileSelect={handleFileSelect}
                  onFileRemove={() => setFile(null)}
                  isDragOver={isDragOver}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                  }}
                  onDrop={(e) => handleDrop(e, handleFileSelect)}
                  onPaste={(e) => handlePaste(e, handleFileSelect, handleTextPaste, file)}
                  maxFileSize={MAX_FILE_SIZE}
                />
              )}
            </div>

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