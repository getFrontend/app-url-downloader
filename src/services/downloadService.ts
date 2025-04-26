import JSZip from 'jszip';
import { FileItem, ProcessedFile } from '@/types';

// Maximum number of download attempts
const MAX_RETRIES = 3;
// Base delay between retry attempts (in milliseconds)
const BASE_RETRY_DELAY = 1000;

/**
 * Downloads a file using XMLHttpRequest
 * XMLHttpRequest sometimes handles CORS restrictions better than fetch
 */
const downloadFileWithXHR = (url: string): Promise<{ blob: Blob, contentType: string }> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    
    // Set timeout to 30 seconds
    xhr.timeout = 30000;
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const contentType = xhr.getResponseHeader('Content-Type') || '';
        resolve({ 
          blob: xhr.response, 
          contentType 
        });
      } else {
        reject(new Error(`Download error: ${xhr.status} ${xhr.statusText}`));
      }
    };
    
    xhr.onerror = () => {
      reject(new Error('Network error while downloading file'));
    };
    
    xhr.ontimeout = () => {
      reject(new Error('Download timeout exceeded'));
    };
    
    xhr.send();
  });
};

/**
 * Converts an image to PNG format
 */
const convertImageToPNG = async (blob: Blob): Promise<{ blob: Blob, isPNG: boolean }> => {
  // Check if the file is an image
  if (!blob.type.startsWith('image/')) {
    return { blob, isPNG: false };
  }
  
  // If it's already PNG, don't convert
  if (blob.type === 'image/png') {
    return { blob, isPNG: true };
  }
  
  try {
    const blobUrl = URL.createObjectURL(blob);
    const img = new Image();
    
    // Load the image
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = blobUrl;
    });
    
    // Create canvas and convert
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to create canvas context');
    }
    
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(blobUrl);
    
    // Get PNG from canvas
    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to convert to PNG'));
      }, 'image/png');
    });
    
    return { blob: pngBlob, isPNG: true };
  } catch (error) {
    console.error('Error converting to PNG:', error);
    return { blob, isPNG: false };
  }
};

/**
 * Downloads a single file with retry attempts
 */
const downloadFile = async (
  item: FileItem,
  retryCount = 0
): Promise<ProcessedFile> => {
  try {
    // Check internet connection
    if (!navigator.onLine) {
      throw new Error('No internet connection');
    }
    
    // Try to download the file directly
    let response;
    try {
      response = await downloadFileWithXHR(item.url);
    } catch (directError) {
      console.warn(`Direct download failed: ${directError instanceof Error ? directError.message : String(directError)}`);
      
      // If direct download failed, try through proxy
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(item.url)}`;
      try {
        response = await downloadFileWithXHR(proxyUrl);
        console.log('Proxy download successful');
      } catch {
        throw new Error(`Failed to download file: ${directError instanceof Error ? directError.message : String(directError)}`);
      }
    }
    
    const { blob, contentType } = response;
    let filename = item.filename;
    
    // Convert image to PNG if necessary
    const { blob: processedBlob, isPNG } = await convertImageToPNG(blob);
    
    // Update file extension if it's PNG
    if (isPNG && !filename.toLowerCase().endsWith('.png')) {
      filename = filename.replace(/\.[^/.]+$/, '') + '.png';
    } else if (!filename.includes('.')) {
      // Add extension based on content type if missing
      const extension = contentType.split('/')[1];
      if (extension) {
        filename = `${filename}.${extension}`;
      }
    }
    
    return {
      blob: processedBlob,
      filename,
      originalUrl: item.url,
      contentType,
      size: processedBlob.size,
      lastModified: new Date().toISOString()
    };
  } catch (error) {
    // Implement retry with exponential backoff
    if (retryCount < MAX_RETRIES) {
      const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Retry ${retryCount + 1}/${MAX_RETRIES} in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return downloadFile(item, retryCount + 1);
    }
    
    throw error;
  }
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