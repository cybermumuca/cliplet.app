import { useState } from 'react';
import { toast } from 'sonner';
import { formatFileSize } from '@/lib/utils';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function useClipboard() {
  const [isDragOver, setIsDragOver] = useState(false);

  function detectClipType(file: File): 'file' | 'audio' | 'video' | 'image' | 'document' {
    const mimeType = file.type.toLowerCase();

    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';

    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];

    if (documentTypes.includes(mimeType)) return 'document';
    return 'file';
  }

  function validateFile(file: File): boolean {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Arquivo muito grande. Tamanho máximo: ${formatFileSize(MAX_FILE_SIZE)}`);
      return false;
    }
    return true;
  }

  function handlePaste(
    e: React.ClipboardEvent,
    onFileSelect: (file: File) => void,
    onTextPaste: (text: string) => void,
    currentFile?: File | null
  ) {
    e.preventDefault();

    const { clipboardData } = e;
    if (!clipboardData) return;

    const files = Array.from(clipboardData.files);

    if (files.length > 0) {
      const newFile = files[0];
      if (!validateFile(newFile)) return;

      if (currentFile) {
        const shouldReplace = window.confirm(
          `Já existe um arquivo selecionado (${currentFile.name}). Deseja substituí-lo pelo novo arquivo (${newFile.name})?`
        );
        if (!shouldReplace) return;
      }

      onFileSelect(newFile);
      toast.success(`${newFile.type.startsWith('image/') ? 'Imagem colada' : 'Arquivo colado'}: ${newFile.name}`);
      return;
    }

    const textData = clipboardData.getData('text');
    if (textData) {
      onTextPaste(textData);
      return;
    }

    toast.error("Conteúdo colado não foi reconhecido");
  }

  function handleDrop(
    e: React.DragEvent,
    onFileSelect: (file: File) => void
  ) {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const droppedFile = files[0];
    if (!validateFile(droppedFile)) return;

    onFileSelect(droppedFile);

    const clipType = detectClipType(droppedFile);
    const typeLabels = {
      image: 'Imagem',
      video: 'Vídeo',
      audio: 'Áudio',
      document: 'Documento',
      file: 'Arquivo'
    };

    toast.success(`${typeLabels[clipType]} arrastado: ${droppedFile.name}`);
  }

  return {
    isDragOver,
    setIsDragOver,
    detectClipType,
    handlePaste,
    handleDrop
  };
}