import { useEffect, useRef, useState } from 'react';

interface UseImageLazyLoadResult {
  imageSrc: string | undefined;
  imageRef: React.RefObject<HTMLImageElement>;
  isLoaded: boolean;
}

/**
 * Hook para lazy loading de imagens usando Intersection Observer
 * Melhora a performance carregando imagens apenas quando estão visíveis
 */
export function useImageLazyLoad(src: string): UseImageLazyLoadResult {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Começa a carregar 50px antes da imagem entrar na tela
        threshold: 0.01,
      }
    );

    observer.observe(imageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src]);

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => setIsLoaded(true);
  }, [imageSrc]);

  return { imageSrc, imageRef, isLoaded };
}
