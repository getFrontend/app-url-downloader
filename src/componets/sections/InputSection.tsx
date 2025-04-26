"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { FileItem } from '@/types';
import { parseUrlList } from '@/utils/parser';

interface InputSectionProps {
  onSubmit: (items: FileItem[]) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ onSubmit }) => {
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setError('Please enter at least one URL');
      return;
    }

    try {
      const items = parseUrlList(urlInput);
      if (items.length === 0) {
        setError('No valid URLs found. Make sure to use the format: url, name');
        return;
      }
      
      onSubmit(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid URL format');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.type !== 'text/plain') {
      setError('Please upload a text (.txt) file');
      return;
    }

    try {
      const text = await file.text();
      setUrlInput(text);
      
      // Auto-submit if the file contains valid URLs
      const items = parseUrlList(text);
      if (items.length > 0) {
        onSubmit(items);
      } else {
        setError('No valid URLs found in the file. Make sure to use the format: url, name');
      }
    } catch (err) {
      setError('Failed to read the file. Error: ' + err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.type !== 'text/plain') {
      setError('Please upload a text (.txt) file');
      return;
    }

    try {
      const text = await file.text();
      setUrlInput(text);
      
      // Auto-submit if the file contains valid URLs
      const items = parseUrlList(text);
      if (items.length > 0) {
        onSubmit(items);
      } else {
        setError('No valid URLs found in the file. Make sure to use the format: url, name');
      }
    } catch (err) {
      setError('Failed to read the file. Error: ' + err);
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Download Multiple Files
      </h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              Enter URLs to download (one per line in the format: url, name)
            </p>
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={openFileSelector}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-blue-700 border border-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Upload TXT
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} onDragEnter={handleDrag}>
          <div 
            className={`relative border-2 ${dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600'
            } rounded-lg transition-colors`}
          >
            <textarea
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (error) setError(null);
              }}
              placeholder="https://example.com/image.png, my-image&#10;https://example.com/document.pdf, important-document"
              className="w-full h-48 p-4 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {dragActive && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-blue-100/80 dark:bg-blue-900/50 rounded-lg"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-blue-800 dark:text-blue-200 font-medium">Drop your file here</p>
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-2 flex items-start text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 mr-1 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Download
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
          How it works:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
          <li>Enter URLs in the format: url, name (one per line)</li>
          <li>Or upload a text file with the same format</li>
          <li>All images will be converted to PNG format</li>
          <li>Long filenames will be separated with hyphens</li>
          <li>All files will be packaged in a downloadable ZIP archive</li>
        </ul>
      </div>
    </div>
  );
};

export default InputSection;