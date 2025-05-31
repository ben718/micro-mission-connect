
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePaginatedQuery } from '../usePaginatedQuery';

// Mock de Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 })
    })
  }
}));

describe('usePaginatedQuery', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  it('should handle pagination correctly', async () => {
    const mockQueryFn = vi.fn().mockResolvedValue({
      data: [{ id: '1', name: 'Test' }],
      count: 1
    });

    const { result } = renderHook(
      () => usePaginatedQuery({
        queryKey: ['test'],
        queryFn: mockQueryFn,
        pageSize: 10
      }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.pagination.currentPage).toBe(1);
  });

  it('should navigate to next page', async () => {
    const mockQueryFn = vi.fn().mockResolvedValue({
      data: [{ id: '1', name: 'Test' }],
      count: 20
    });

    const { result } = renderHook(
      () => usePaginatedQuery({
        queryKey: ['test'],
        queryFn: mockQueryFn,
        pageSize: 10
      }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.pagination.goToNextPage();

    await waitFor(() => {
      expect(result.current.pagination.currentPage).toBe(2);
    });
  });
});
