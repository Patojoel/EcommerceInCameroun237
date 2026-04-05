import { useEffect, useMemo } from 'react';
import { useApiCacheStore } from '@/store/apiCacheStore';

export function useApiCache<T>(key: string, serverData: T[]): T[] {
  const { cache, setCache } = useApiCacheStore();

  useEffect(() => {
    try {
      const stringified = JSON.stringify(serverData);
      if (!cache[key] || cache[key].hash !== stringified) {
        setCache(key, stringified, serverData);
      }
    } catch {
      // Ignore stringify errors (e.g. circular refs)
    }
  }, [serverData, key, cache, setCache]);

  const data = useMemo(() => {
    return cache[key] && Array.isArray(cache[key].data)
      ? (cache[key].data as T[])
      : serverData;
  }, [cache, key, serverData]);

  return data;
}
