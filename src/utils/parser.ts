import { FileItem } from "@/types";

// Parse a list of URLs in the format "url, name"
export const parseUrlList = (text: string): FileItem[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  return lines.map(line => {
    const parts = line.split(',');
    
    if (parts.length < 2) {
      throw new Error(`Invalid format in line: ${line}. Expected: url, name`);
    }
    
    const url = parts[0].trim();
    const name = parts.slice(1).join(',').trim();
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid URL: ${url}`);
    }
    
    // Format the filename
    const filename = formatFilename(name);
    
    return { url, filename };
  });
};

// Format a filename, replacing spaces with hyphens
export const formatFilename = (name: string): string => {
  // Replace spaces with hyphens and remove any special characters
  let filename = name.replace(/\s+/g, '-').replace(/[^\w\-\.]/g, '');
  
  // Ensure the filename isn't too long
  if (filename.length > 100) {
    const ext = filename.includes('.') ? filename.substring(filename.lastIndexOf('.')) : '';
    const base = filename.substring(0, filename.lastIndexOf('.'));
    filename = base.substring(0, 96) + ext;
  }
  
  return filename;
};