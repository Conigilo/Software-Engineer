import { useState, useEffect, useCallback } from 'react';

export function useBrowserRouter(defaultPath = '/participant/home') {
  const getInitialPath = () => {
    if (typeof window === 'undefined') return defaultPath;
    const p = window.location.pathname;
    if (!p || p === '/') {
      window.history.replaceState({}, '', defaultPath);
      return defaultPath;
    }
    return p;
  };

  const [pathname, setPathname] = useState<string>(getInitialPath);

  const navigate = useCallback((nextPath: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setPathname(nextPath);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setPathname(window.location.pathname || defaultPath);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [defaultPath]);

  return { pathname, navigate };
}
