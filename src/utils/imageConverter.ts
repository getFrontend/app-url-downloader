/**
 * Converts an image to PNG format
 */
export const convertImageToPNG = async (blob: Blob): Promise<{ blob: Blob, isPNG: boolean }> => {
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
 * Updates filename based on content type and conversion results
 */
export const updateFilename = (filename: string, contentType: string, isPNG: boolean): string => {
  // Update file extension if it's PNG
  if (isPNG && !filename.toLowerCase().endsWith('.png')) {
    return filename.replace(/\.[^/.]+$/, '') + '.png';
  } 
  
  // Add extension based on content type if missing
  if (!filename.includes('.')) {
    const extension = contentType.split('/')[1];
    if (extension) {
      return `${filename}.${extension}`;
    }
  }
  
  return filename;
};