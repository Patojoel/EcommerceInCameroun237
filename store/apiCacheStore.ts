import { create } from 'zustand';

interface CacheState {
  cache: Record<string, { hash: string; data: any[] }>;
  setCache: (key: string, hash: string, data: any[]) => void;
}

export const useApiCacheStore = create<CacheState>((set) => ({
  cache: {},
  setCache: (key, hash, data) =>
    set((state) => ({
      cache: {
        ...state.cache,
        [key]: { hash, data },
      },
    })),
}));
