# URL Downloader App

A modern web application for downloading files from URLs and creating a ZIP archive. Built with Next.js, React, and Tailwind CSS.

![URL Downloader Logo](/public/app-preview.png)

## Features

- 🔗 Download files from multiple URLs simultaneously
- 📦 Automatically create ZIP archives of downloaded files
- 🖼️ Convert images to PNG format when needed
- 🌓 Dark/Light theme support
- 🔄 CORS bypass using multiple proxy servers
- 📱 Responsive design for all devices

## How It Works

1. Enter a list of URLs in the format: `url, filename`
2. The application downloads each file, handling CORS restrictions
3. Files are processed and packaged into a ZIP archive
4. Download the complete archive with a single click

## Technology Stack

- **Framework**: Next.js 15.3
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.1
- **File Processing**: JSZip for archive creation

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage Examples

The application accepts URLs in the following format:

```
https://example.com/image.jpg, my-image
https://example.com/document.pdf, important-document
```

Each line should contain a URL and a filename separated by a comma.

## Project Structure

- `/src/components` - React components
- `/src/utils` - Utility functions for file processing
- `/src/types` - TypeScript type definitions
- `/public` - Static assets

## Key Components

- **DownloaderService** - Main application component
- **FileDownloader** - Handles file downloads with retry logic and proxy support
- **ArchiveCreator** - Creates ZIP archives from downloaded files
- **ImageConverter** - Converts images to PNG format when needed
