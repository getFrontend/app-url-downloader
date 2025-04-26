"use client";

import React, { useEffect, useState } from 'react';
import { FileItem, ProcessingStatus } from '@/types';
import { Download, Archive, CheckCircle2 } from 'lucide-react';

interface ProcessingSectionProps {
  status: ProcessingStatus;
  progress: number;
  fileItems: FileItem[];
}

const ProcessingSection: React.FC<ProcessingSectionProps> = ({ 
  status, 
  progress, 
  fileItems 
}) => {
  const [processedItems, setProcessedItems] = useState<number>(0);
  
  // Simulate processing individual files
  useEffect(() => {
    if (status === 'processing' && fileItems.length > 0) {
      const processed = Math.floor((progress / 100) * fileItems.length);
      setProcessedItems(processed);
    }
  }, [progress, fileItems.length, status]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        {status === 'processing' ? 'Downloading Files' : 'Creating Archive'}
      </h2>
      
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-gray-700 dark:text-gray-300">
            {status === 'processing' 
              ? `Downloaded ${processedItems} of ${fileItems.length} files` 
              : 'Preparing your download archive'}
          </span>
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {status === 'processing' ? `${Math.round(progress)}%` : 'Almost there...'}
          </span>
        </div>
        
        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {status === 'processing' && fileItems.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-white">Processing Files</h3>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {fileItems.map((item, index) => {
              const isProcessed = index < processedItems;
              
              return (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                    isProcessed ? 'bg-green-50 dark:bg-green-900/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`flex-shrink-0 ${isProcessed ? 'text-green-500' : 'text-gray-400'}`}>
                      {isProcessed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Download className="h-5 w-5" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-sm text-gray-800 dark:text-gray-200 font-medium">
                        {item.filename}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {item.url}
                      </p>
                    </div>
                  </div>
                  
                  {isProcessed && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Downloaded
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {status === 'creating-archive' && (
        <div className="flex flex-col items-center justify-center py-6">
          <Archive className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-4 animate-pulse" />
          <p className="text-gray-700 dark:text-gray-300 text-center">
            Creating your ZIP archive...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            This should take just a moment
          </p>
        </div>
      )}
    </div>
  );
};

export default ProcessingSection;