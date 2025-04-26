export type ProcessingStatus = 'idle' | 'processing' | 'paused' | 'creating-archive' | 'complete' | 'error';

export interface FileItem {
  url: string;
  filename: string;
}

export interface ProcessedFile {
  blob: Blob;
  filename: string;
  originalUrl: string;
  contentType?: string;
  size?: number;
  lastModified?: string;
}