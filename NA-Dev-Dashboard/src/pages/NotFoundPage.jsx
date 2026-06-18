import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Page Not Found');

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-7xl font-bold text-[#eef2ff]">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mt-4">Page not found</h1>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] transition-colors"
      >
        <Home size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}
