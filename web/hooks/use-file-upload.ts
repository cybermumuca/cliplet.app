import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface UploadFileParams {
  file: File;
  detectClipType: (file: File) => 'file' | 'audio' | 'video' | 'image' | 'document';
}

async function getImageMetadata(file: File) {
  return new Promise<any>((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: (img.width / img.height).toFixed(2)
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => resolve({});
    img.src = URL.createObjectURL(file);
  });
}

async function getVideoMetadata(file: File) {
  return new Promise<any>((resolve) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      resolve({
        duration: Math.round(video.duration),
        width: video.videoWidth,
        height: video.videoHeight,
        aspectRatio: video.videoWidth && video.videoHeight
          ? (video.videoWidth / video.videoHeight).toFixed(2)
          : null
      });
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => resolve({});
    video.src = URL.createObjectURL(file);
  });
}

async function getAudioMetadata(file: File) {
  return new Promise<any>((resolve) => {
    const audio = document.createElement('audio');
    audio.onloadedmetadata = () => {
      resolve({
        duration: Math.round(audio.duration)
      });
      URL.revokeObjectURL(audio.src);
    };
    audio.onerror = () => resolve({});
    audio.src = URL.createObjectURL(file);
  });
}

async function uploadFile({ file, detectClipType }: UploadFileParams) {
  // 1. Gerar URL de upload
  console.log('Iniciando geração de URL de upload do arquivo:', file);

  const uploadResponse = await fetch('/api/clips/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalFileName: file.name,
      originalFileSize: file.size,
      originalMimeType: file.type
    })
  });

  console.log('URL de upload gerada:', uploadResponse);

  if (!uploadResponse.ok) {
    throw new Error('Erro ao gerar URL de upload');
  }

  const { uploadUrl, fileKey } = await uploadResponse.json();

  console.log('URL de upload e chave do arquivo recebidas:', { uploadUrl, fileKey });

  // 2. Upload do arquivo
  const putResponse = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type, 'Content-Length': String(file.size) }
  });

  if (!putResponse.ok) {
    throw new Error('Erro ao fazer upload do arquivo');
  }

  console.log('Arquivo enviado para o bucket com sucesso:', putResponse);

  // 3. Salvar clip
  const clipType = detectClipType(file);
  let typeSpecificMetadata = {};

  try {
    if (clipType === 'image') {
      typeSpecificMetadata = await getImageMetadata(file);
    } else if (clipType === 'video') {
      typeSpecificMetadata = await getVideoMetadata(file);
    } else if (clipType === 'audio') {
      typeSpecificMetadata = await getAudioMetadata(file);
    }
  } catch (error) {
    console.warn('Erro ao extrair metadados específicos:', error);
  }

  const clipData = {
    type: clipType,
    fileKey,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    originalFileName: file.name,
    ...typeSpecificMetadata,
  };

  const saveResponse = await fetch('/api/clips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clipData)
  });

  if (!saveResponse.ok) {
    throw new Error('Erro ao salvar clip');
  }

  return await saveResponse.json();
}

export function useFileUpload() {
  return useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      toast.success('Arquivo salvo com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao salvar arquivo: ${error.message}`);
    }
  });
}