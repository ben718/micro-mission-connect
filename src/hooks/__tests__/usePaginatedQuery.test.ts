
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePaginatedQuery } from '../usePaginatedQuery';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );
};

describe('usePaginatedQuery', () => {
  it('should initialize with default values', () => {
    const mockQueryFn = vi.fn().mockResolvedValue({ data: [], count: 0 });
    
    const { result } = renderHook(
      () => usePaginatedQuery({
        queryKey: ['test'],
        queryFn: mockQueryFn
      }),
      { wrapper: createWrapper() }
    );

    expect(result.current.currentPage).toBe(1);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it('should calculate total pages correctly', async () => {
    const mockQueryFn = vi.fn().mockResolvedValue({ 
      data: Array(10).fill({}), 
      count: 25 
    });
    
    const { result } = renderHook(
      () => usePaginatedQuery({
        queryKey: ['test'],
        queryFn: mockQueryFn,
        pageSize: 10
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.totalPages).toBe(3);
    });
  });

  it('should handle page navigation', () => {
    const mockQueryFn = vi.fn().mockResolvedValue({ 
      data: [], 
      count: 30 
    });
    
    const { result } = renderHook(
      () => usePaginatedQuery({
        queryKey: ['test'],
        queryFn: mockQueryFn,
        pageSize: 10
      }),
      { wrapper: createWrapper() }
    );

    // Go to next page
    result.current.goToNextPage();
    expect(result.current.currentPage).toBe(2);

    // Go to previous page
    result.current.goToPreviousPage();
    expect(result.current.currentPage).toBe(1);

    // Go to specific page
    result.current.goToPage(3);
    expect(result.current.currentPage).toBe(3);
  });

  it('should not allow navigation beyond bounds', () => {
    const mockQueryFn = vi.fn().mockResolvedValue({ 
      data: [], 
      count: 10 
    });
    
    const { result } = renderHook(
      () => usePaginatedQuery({
        queryKey: ['test'],
        queryFn: mockQueryFn,
        pageSize: 10
      }),
      { wrapper: createWrapper() }
    );

    // Try to go to page 0
    result.current.goToPage(0);
    expect(result.current.currentPage).toBe(1);

    // Try to go beyond total pages
    result.current.goToPage(5);
    expect(result.current.currentPage).toBe(1); // Should stay on current page
  });

  it('should call queryFn with correct parameters', () => {
    const mockQueryFn = vi.fn().mockResolvedValue({ 
      data: [], 
      count: 0 
    });
    
    renderHook(
      () => usePaginatedQuery({
        queryKey: ['test'],
        queryFn: mockQueryFn,
        pageSize: 15
      }),
      { wrapper: createWrapper() }
    );

    expect(mockQueryFn).toHaveBeenCalledWith(1, 15);
  });
});
