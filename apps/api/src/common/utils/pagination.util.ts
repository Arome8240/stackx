export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalPages: number;
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    items,
    total,
    page,
    limit,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    totalPages,
  };
}

export function getSkip(page: number, limit: number): number {
  return (Math.max(1, page) - 1) * limit;
}

export function normalizePage(page: unknown, defaultPage = 1): number {
  const n = parseInt(String(page), 10);
  return isNaN(n) || n < 1 ? defaultPage : n;
}

export function normalizeLimit(limit: unknown, defaultLimit = 20, maxLimit = 100): number {
  const n = parseInt(String(limit), 10);
  if (isNaN(n) || n < 1) return defaultLimit;
  return Math.min(n, maxLimit);
}
