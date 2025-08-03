export type ClipTypes = "text" | "image" | "video" | "audio" | "document" | "file";

export interface ClipItem {
  id: string;
  type: ClipTypes;
  content: string;
  filename?: string;
  createdAt: string;
}

export interface Clip {
  id: string;
  type: ClipTypes;
  createdAt: string;
}

export interface TextClip extends Clip {
  type: "text";
  content: string;
}

export interface ImageClip extends Clip {
  type: "image";
  content: string;
  metadata: {
    size: number;
    mimeType: string;
    fileName: string;
    width: number;
    height: number;
  }
}

export interface VideoClip extends Clip {
  type: "video";
  content: string;
  metadata: {
    size: number;
    mimeType: string;
    fileName: string;
    duration: number;
    width: number;
    height: number;
  }
}

export interface AudioClip extends Clip {
  type: "audio";
  content: string;
  metadata: {
    size: number;
    mimeType: string;
    fileName: string;
    duration: number;
  }
}

export interface DocumentClip extends Clip {
  type: "document";
  content: string;
  metadata: {
    size: number;
    mimeType: string;
    fileName: string;
  }
}

export interface FileClip extends Clip {
  type: "file";
  content: string;
  metadata: {
    size: number;
    fileName: string;
  }
}