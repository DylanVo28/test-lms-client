import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

const PageProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isBackNavigationRef = useRef(false);
  const previousUrlRef = useRef<string>('');

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    // Detect browser back/forward button
    const handlePopState = () => {
      isBackNavigationRef.current = true;
    };

    window.addEventListener('popstate', handlePopState);

    const handleRouteChangeStart = (url: string) => {
      // Skip progress bar if next navigation is marked as "no progress" (e.g. logout)
      if ((window as any).__skipNextProgressBar) {
        (window as any).__skipNextProgressBar = false;
        return;
      }

      // Reset back navigation flag after a short delay
      setTimeout(() => {
        isBackNavigationRef.current = false;
      }, 100);

      // Only show progress bar if not back navigation
      if (!isBackNavigationRef.current) {
        setIsLoading(true);
        setProgress(0);
        previousUrlRef.current = url;
        
        // Simulate progress
        progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              return 90;
            }
            return prev + Math.random() * 15;
          });
        }, 100);
      }
    };

    const handleRouteChangeComplete = () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      // Only complete progress if we were loading (not back navigation)
      if (isLoading) {
        setProgress(100);
        
        // Hide after a short delay
        timeoutId = setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
      }
    };

    const handleRouteChangeError = () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setIsLoading(false);
      setProgress(0);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router, isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
      <div
        className="h-full bg-[#00A8CE] transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default PageProgressBar;

