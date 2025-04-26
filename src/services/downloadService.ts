import JSZip from 'jszip';
import { FileItem, ProcessedFile } from '@/types';
import { downloadWithProxies, withRetry } from '../utils/fileDownloader';
import { convertImageToPNG, updateFilename } from '../utils/imageConverter';

/**
 * Downloads a single file with retry and proxy handling
 */
const downloadFile = async (item: FileItem): Promise<ProcessedFile> => {
  // Check internet connection
  if (!navigator.onLine) {
    throw new Error('No internet connection');
  }
  
  // Download with retry logic
  const response = await withRetry(() => downloadWithProxies(item.url));
  
  const { blob, contentType } = response;
  
  // Convert image to PNG if necessary
  const { blob: processedBlob, isPNG } = await convertImageToPNG(blob);
  
  // Update filename based on content type and conversion
  const filename = updateFilename(item.filename, contentType, isPNG);
  
  return {
    blob: processedBlob,
    filename,
    originalUrl: item.url,
    contentType,
    size: processedBlob.size,
    lastModified: new Date().toISOString()
  };
};

/**
 * Downloads all files from the list
 */
export const downloadFiles = async (
  items: FileItem[],
  onProgress: (progress: number) => void
): Promise<ProcessedFile[]> => {
  const total = items.length;
  const processedFiles: ProcessedFile[] = [];
  const failedItems: { item: FileItem, error: string }[] = [];
  
  for (let i = 0; i < items.length; i++) {
    try {
      const file = await downloadFile(items[i]);
      processedFiles.push(file);
    } catch (error) {
      console.error(`Error downloading ${items[i].url}:`, error);
      failedItems.push({
        item: items[i],
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Update progress
    const progress = Math.round(((i + 1) / total) * 100);
    onProgress(progress);
    
    // Small delay to update UI
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // If all files failed to download, throw an error
  if (processedFiles.length === 0 && failedItems.length > 0) {
    throw new Error(
      `Failed to download any files. Error for first file: ${failedItems[0].error}`
    );
  }
  
  // Log download results
  if (failedItems.length > 0) {
    console.warn(
      `Download summary:\n` +
      `- Failed: ${failedItems.length} file(s)\n` +
      `- Successfully downloaded: ${processedFiles.length} file(s)`
    );
  }
  
  return processedFiles;
};


/**
 * Creates a ZIP archive from downloaded files
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