
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface OptimizedQueryOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  staleTime?: number;
  cacheTime?: number;
  enabled?: boolean;
}

export function useOptimizedQuery<T>({
  queryKey,
  queryFn,
  staleTime = 5 * 60 * 1000, // 5 minutes
  cacheTime = 10 * 60 * 1000, // 10 minutes
  enabled = true
}: OptimizedQueryOptions<T>) {
  const query = useQuery({
    queryKey,
    queryFn,
    staleTime,
    gcTime: cacheTime,
    enabled,
  });

  const memoizedData = useMemo(() => query.data, [query.data]);

  return {
    ...query,
    data: memoizedData,
  };
}
