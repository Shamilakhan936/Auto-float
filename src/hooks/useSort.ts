import { useState, useMemo, useCallback } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  column: string;
  direction: SortDirection;
}

interface UseSortOptions<T> {
  initialSort?: SortConfig;
  customSort?: (data: T[], config: SortConfig) => T[];
}

interface UseSortResult<T> {
  sortedData: T[];
  sortConfig: SortConfig | null;
  handleSort: (column: string) => void;
  setSortConfig: (config: SortConfig | null) => void;
}

/**
 * Hook for sorting data arrays
 */
export function useSort<T extends Record<string, any>>(
  data: T[],
  options: UseSortOptions<T> = {}
): UseSortResult<T> {
  const { initialSort, customSort } = options;
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(initialSort || null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    if (customSort) {
      return customSort([...data], sortConfig);
    }

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.column];
      const bVal = b[sortConfig.column];

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Compare values
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.localeCompare(bVal);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // Date comparison
      if (aVal instanceof Date && bVal instanceof Date) {
        return sortConfig.direction === 'asc'
          ? aVal.getTime() - bVal.getTime()
          : bVal.getTime() - aVal.getTime();
      }

      // String date comparison (ISO format)
      const aDate = new Date(aVal);
      const bDate = new Date(bVal);
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return sortConfig.direction === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      // Fallback to string comparison
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig, customSort]);

  const handleSort = useCallback((column: string) => {
    setSortConfig((prev) => {
      if (prev?.column === column) {
        return {
          column,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { column, direction: 'asc' };
    });
  }, []);

  return {
    sortedData,
    sortConfig,
    handleSort,
    setSortConfig,
  };
}

