import { useState, useEffect, useRef } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Cache global para armazenar respostas das APIs
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useFetch<T>(url: string, enableCache = true): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Cancela requisição anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);
      
      try {
        // Verifica cache
        if (enableCache) {
          const cached = cache.get(url);
          if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            setData(cached.data);
            setLoading(false);
            return;
          }
        }

        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Armazena no cache
        if (enableCache) {
          cache.set(url, { data: result, timestamp: Date.now() });
        }

        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Requisição foi cancelada, não faz nada
          return;
        }
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup: cancela requisição ao desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, refetchKey, enableCache]);

  const refetch = () => {
    // Limpa cache ao fazer refetch
    cache.delete(url);
    setRefetchKey(prev => prev + 1);
  };

  return { data, loading, error, refetch };
}
