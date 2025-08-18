'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export interface FilterOptions {
  category?: string;
  ordering?: string;
  search?: string;
  page?: number;
}

export function useFilterSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilters = useMemo(() => ({
    category: searchParams.get('category') || 'all',
    ordering: searchParams.get('ordering') || 'order',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
  }), [searchParams]);

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or remove parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset page to 1 when filters change
    if (Object.keys(newFilters).some(key => key !== 'page')) {
      params.set('page', '1');
    }

    // Build the new URL
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(`/services${newUrl}`);
  }, [router, searchParams]);

  const setCategory = useCallback((category: string) => {
    updateFilters({ category: category === 'all' ? undefined : category });
  }, [updateFilters]);

  const setOrdering = useCallback((ordering: string) => {
    updateFilters({ ordering });
  }, [updateFilters]);

  const setSearch = useCallback((search: string) => {
    updateFilters({ search: search || undefined });
  }, [updateFilters]);

  const setPage = useCallback((page: number) => {
    updateFilters({ page });
  }, [updateFilters]);

  const clearFilters = useCallback(() => {
    router.push('/services');
  }, [router]);

  return {
    currentFilters,
    updateFilters,
    setCategory,
    setOrdering,
    setSearch,
    setPage,
    clearFilters,
  };
}
