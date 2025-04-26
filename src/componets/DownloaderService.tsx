"use client";

import React, { useState } from "react";
import Header from "./ui/Header";
import Footer from "./ui/Footer";
import InputSection from "./sections/InputSection";
import ProcessingSection from "./sections/ProcessingSection";
import DownloadSection from "./sections/DownloadSection";
import { FileItem, ProcessingStatus } from "@/types";
import { downloadFiles, createZipArchive } from "@/services/downloadService";

const DownloaderService: React.FC = () => {
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [archiveUrl, setArchiveUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processUrls = async (items: FileItem[]) => {
    setFileItems(items);
    setStatus("processing");
    setProgress(0);
    setError(null);
    setArchiveUrl(null);

    try {
      // Download the files
      const downloadedFiles = await downloadFiles(items, (progress) => {
        setProgress(progress);
      });

      // Create zip archive
      setStatus("creating-archive");
      const archiveBlob = await createZipArchive(downloadedFiles);
      const url = URL.createObjectURL(archiveBlob);

      setArchiveUrl(url);
      setStatus("complete");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setStatus("error");
    }
  };

  const resetProcess = () => {
    setFileItems([]);
    setStatus("idle");
    setProgress(0);
    setError(null);

    // Clean up the object URL to prevent memory leaks
    if (archiveUrl) {
      URL.revokeObjectURL(archiveUrl);
      setArchiveUrl(null);
    }
  };

  return (
    <div className="container mx-auto flex flex-col px-4 py-8 max-w-5xl">
      <Header />

      <main className="flex-1 my-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
        {status === "idle" && <InputSection onSubmit={processUrls} />}

        {["processing", "creating-archive"].includes(status) && (
          <ProcessingSection
            status={status}
            progress={progress}
            fileItems={fileItems}
          />
        )}

        {(status === "complete" || status === "error") && (
          <DownloadSection
            status={status}
            archiveUrl={archiveUrl}
            error={error}
            fileCount={fileItems.length}
            onReset={resetProcess}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DownloaderService;
