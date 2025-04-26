// Constants
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1000;

// List of proxy servers to bypass CORS
const PROXY_SERVERS = [
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
  (url: string) => `https://crossorigin.me/${url}`
];

/**
 * Downloads a file using XMLHttpRequest
 * XMLHttpRequest sometimes handles CORS restrictions better than fetch
 */
export const downloadWithXHR = (url: string): Promise<{ blob: Blob, contentType: string }> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    
    // Set timeout to 2 seconds
    xhr.timeout = 2000;
    
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
 * Attempts to download a file with proxies if direct download fails
 */
export const downloadWithProxies = async (url: string): Promise<{ blob: Blob, contentType: string }> => {
  try {
    // Try direct download first
    return await downloadWithXHR(url);
  } catch (directError) {
    console.warn(`Direct download failed: ${directError instanceof Error ? directError.message : String(directError)}`);
    
    // Try each proxy server in sequence
    let proxyError = directError;
    for (const proxyGenerator of PROXY_SERVERS) {
      try {
        const proxyUrl = proxyGenerator(url);
        console.log(`Trying proxy: ${proxyUrl.split('?')[0]}`);
        const response = await downloadWithXHR(proxyUrl);
        console.log('Proxy download successful');
        return response;
      } catch (err) {
        proxyError = err;
        console.warn(`Proxy failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    
    // If all proxies failed, throw the last error
    throw new Error(`Failed to download file: ${proxyError instanceof Error ? proxyError.message : String(proxyError)}`);
  }
};

/**
 * Implements retry logic with exponential backoff
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = MAX_RETRIES,
  baseDelay = BASE_RETRY_DELAY
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retry ${attempt + 1}/${maxRetries} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};