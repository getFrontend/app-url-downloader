"use client";

import React from 'react';
import { CheckCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { ProcessingStatus } from '@/types';

interface DownloadSectionProps {
  status: ProcessingStatus;
  archiveUrl: string | null;
  error: string | null;
  fileCount: number;
  onReset: () => void;
}

const DownloadSection: React.FC<DownloadSectionProps> = ({
  status,
  archiveUrl,
  error,
  fileCount,
  onReset
}) => {
  return (
    <div className="p-8">
      {status === 'complete' ? (
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            Your Files Are Ready!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Successfully processed {fileCount} {fileCount === 1 ? 'file' : 'files'} and created your archive.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {archiveUrl && (
              <a
                href={archiveUrl}
                download="downloaded_files.zip"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Archive
              </a>
            )}
            
            <button
              onClick={onReset}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Start New Download
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/30 mb-6 ">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            Something Went Wrong
          </h2>
          
          <p className="text-red-600 dark:text-red-400 mb-2">
            {error || 'An unexpected error occurred'}
          </p>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please try again or check the URL format.
          </p>
          
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadSection;