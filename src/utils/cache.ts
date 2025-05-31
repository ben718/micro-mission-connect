
class SimpleCache<T> {
  private cache = new Map<string, { data: T; timestamp: number; ttl: number }>();

  set(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  size(): number {
    return this.cache.size;
  }
}

// Cache global pour les données
export const dataCache = new SimpleCache<any>();

// Cache pour les images
export const imageCache = new SimpleCache<string>();

// Fonction utilitaire pour cache des requêtes
export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  const cached = dataCache.get(key);
  if (cached) {
    return Promise.resolve(cached);
  }

  return fetcher().then(data => {
    dataCache.set(key, data, ttl);
    return data;
  });
}
