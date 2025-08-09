import { Left, Right } from '@/lib/either';
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

async function getURLUpload(file: File) {
  try {
    const uploadResponse = await fetch('/api/clips/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalFileSize: file.size,
        originalMimeType: file.type
      })
    });

    if (!uploadResponse.ok) {
      return Left.create({
        code: 'UPLOAD_URL_ERROR',
        message: 'Erro ao gerar URL de upload'
      })
    }
    const { uploadUrl, fileKey, uniqueFileName } = await uploadResponse.json();

    return Right.create({ uploadUrl, fileKey, uniqueFileName });
  } catch {
    return Left.create({
      code: 'UPLOAD_URL_EXCEPTION',
      message: 'Erro desconhecido ao gerar URL de upload'
    });
  }
}

async function uploadToBucket(uploadURL: string, file: File) {
  try {
    const putResponse = await fetch(uploadURL, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type, 'Content-Length': String(file.size) }
    });

    if (!putResponse.ok) {
      return Left.create({
        code: 'UPLOAD_ERROR',
        message: 'Erro ao fazer upload do arquivo'
      });
    }

    return Right.create({ success: true });
  } catch {
    return Left.create({
      code: 'UPLOAD_EXCEPTION',
      message: 'Erro desconhecido ao fazer upload do arquivo'
    });
  }
}

async function uploadFile({ file, detectClipType }: UploadFileParams) {
  // 1. Gerar URL de upload
  const getUploadURLResult = await getURLUpload(file);

  if (getUploadURLResult.isLeft()) {
    throw new Error(getUploadURLResult.error.message);
  }

  const { uploadUrl, fileKey } = getUploadURLResult.value;

  // 2. Upload do arquivo
  const uploadResult = await uploadToBucket(uploadUrl, file);

  if (uploadResult.isLeft()) {
    throw new Error(uploadResult.error.message);
  }

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
    fileSize: file.size,
    mimeType: file.type ?? undefined,
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