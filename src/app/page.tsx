import DownloaderService from "@/componets/DownloaderService";
import { ThemeProvider } from "@/componets/theme/ThemeProvider";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <DownloaderService />
      </div>
    </ThemeProvider>
  );
}
