import JSZip from 'jszip';
import { ProcessedFile } from '@/types';

/**
 * Creates a ZIP archive from processed files
 */
export const createZipArchive = async (files: ProcessedFile[]): Promise<Blob> => {
  if (files.length === 0) {
    throw new Error('No files to archive. All downloads may have failed.');
  }
  
  const zip = new JSZip();
  
  // Add each file to the archive
  files.forEach(file => {
    zip.file(file.filename, file.blob);
  });
  
  // Generate ZIP file
  return await zip.generateAsync({ type: 'blob' });
};