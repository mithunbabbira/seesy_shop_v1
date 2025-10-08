import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjhmOSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+Q2hhcmdlbWVudC4uLjwvdGV4dD4KICA8L3N2Zz4K',
  fallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZlZjJmMiIgc3Ryb2tlPSIjZjNmNGY2IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSI3NSIgY3k9IjYwIiByPSIxMCIgZmlsbD0iI2Q5ZDlkOSIvPgogIDxwYXRoIGQ9Im0xMDAgMTEwIDMwLTMwIDMwIDMwIDI1LTI1djQ1SDE1MHptLTUwIDEwIDIwLTIwIDMwIDMwdi0xMGgtNTB2LTEweiIgZmlsbD0iI2Q5ZDlkOSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSI0NXB4Ij5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD4KICA8L3N2Zz4K',
  lazy = true,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  // Preload image for better UX
  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    
    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    
    img.src = src;

    // If image is already cached, it might load immediately
    if (img.complete) {
      if (img.naturalWidth > 0) {
        handleLoad();
      } else {
        handleError();
      }
    }

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src, isInView, onLoad, onError]);

  const getCurrentSrc = () => {
    if (hasError) return fallback;
    if (isLoading || !isInView) return placeholder;
    return src;
  };

  const getAriaLabel = () => {
    if (hasError) return 'Image non disponible';
    if (isLoading) return 'Chargement de l\'image...';
    return alt;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      role="img"
      aria-label={getAriaLabel()}
    >
      {/* Loading overlay */}
      {isLoading && isInView && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full mb-2 animate-bounce" />
            <div className="text-xs text-gray-500">Chargement...</div>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center z-10">
          <svg 
            className="w-12 h-12 text-gray-400 mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span className="text-xs text-gray-500 text-center px-2">
            Image non disponible
          </span>
        </div>
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={getCurrentSrc()}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading && isInView ? 'opacity-0' : 'opacity-100'
        } ${hasError ? 'opacity-50' : ''}`}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        style={{
          filter: isLoading && isInView ? 'blur(5px)' : 'none',
          transform: isLoading && isInView ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.3s ease-in-out',
        }}
      />

      {/* Skeleton loader for non-lazy images */}
      {!lazy && isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
    </div>
  );
};

export default OptimizedImage;