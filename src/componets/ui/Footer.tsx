import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-12 flex items-center justify-between gap-2 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>
        &copy; {new Date().getFullYear()} - URL Downloader app by {}
        <span className="font-semibold">Sergey</span>
      </p>

      <a
        href="https://github.com/getFrontend"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Github className="h-4 w-4" />
        <span className="sr-only">GitHub</span>
      </a>
    </footer>
  );
};

export default Footer;
