import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — NA Dev Studio` : 'NA Dev Studio — Dashboard';
    return () => {
      document.title = prev;
    };
  }, [title]);
}
