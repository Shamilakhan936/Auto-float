import { useMemo } from 'react';

type FilterFunction<T> = (item: T) => boolean;

interface UseFilterOptions<T> {
  searchTerm?: string;
  searchFields?: (keyof T)[];
  customFilters?: FilterFunction<T>[];
}

/**
 * Hook for filtering data arrays with search and custom filters
 */
export function useFilter<T extends Record<string, any>>(
  data: T[],
  options: UseFilterOptions<T> = {}
): T[] {
  const { searchTerm = '', searchFields, customFilters = [] } = options;

  return useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm && searchFields && searchFields.length > 0) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value != null && String(value).toLowerCase().includes(lowerSearchTerm);
        })
      );
    } else if (searchTerm) {
      // If no specific fields, search all string/number fields
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value != null && String(value).toLowerCase().includes(lowerSearchTerm)
        )
      );
    }

    // Apply custom filters
    if (customFilters.length > 0) {
      filtered = filtered.filter((item) =>
        customFilters.every((filterFn) => filterFn(item))
      );
    }

    return filtered;
  }, [data, searchTerm, searchFields, customFilters]);
}

