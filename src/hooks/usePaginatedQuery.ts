
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";

interface PaginatedQueryOptions<T> {
  queryKey: string[];
  queryFn: (page: number, limit: number) => Promise<{ data: T[]; count: number }>;
  pageSize?: number;
  enabled?: boolean;
  staleTime?: number;
}

export function usePaginatedQuery<T>({
  queryKey,
  queryFn,
  pageSize = 10,
  enabled = true,
  staleTime = 5 * 60 * 1000
}: PaginatedQueryOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const queryResult = useQuery({
    queryKey: [...queryKey, 'page', currentPage, 'limit', pageSize],
    queryFn: () => queryFn(currentPage, pageSize),
    enabled,
    staleTime,
    gcTime: 15 * 60 * 1000,
    placeholderData: (previousData) => previousData
  });

  const totalPages = useMemo(() => {
    if (!queryResult.data?.count) return 1;
    return Math.ceil(queryResult.data.count / pageSize);
  }, [queryResult.data?.count, pageSize]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);

  return {
    ...queryResult,
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
}
