
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useErrorHandler } from '../useErrorHandler';

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}));

describe('useErrorHandler', () => {
  it('should handle Error objects', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error');
    
    const message = result.current.handleError(error, 'test-context', { showToast: false });
    expect(message).toBe('Test error');
  });

  it('should handle string errors', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    const message = result.current.handleError('String error', 'test-context', { showToast: false });
    expect(message).toBe('String error');
  });

  it('should handle unknown errors with fallback', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    const message = result.current.handleError(null, 'test-context', { 
      showToast: false,
      fallbackMessage: 'Custom fallback'
    });
    expect(message).toBe('Custom fallback');
  });

  it('should handle objects with message property', () => {
    const { result } = renderHook(() => useErrorHandler());
    const errorObject = { message: 'Object error message' };
    
    const message = result.current.handleError(errorObject, 'test-context', { showToast: false });
    expect(message).toBe('Object error message');
  });
});
