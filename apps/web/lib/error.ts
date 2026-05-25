export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class WalletError extends AppError {
  constructor(message = 'Wallet operation failed') {
    super(message, 'WALLET_ERROR');
    this.name = 'WalletError';
  }
}

export class ContractError extends AppError {
  constructor(message = 'Contract call failed', public readonly txId?: string) {
    super(message, 'CONTRACT_ERROR');
    this.name = 'ContractError';
  }
}

export function parseApiError(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unexpected error occurred';
}

export function isAuthError(error: unknown): boolean {
  return error instanceof UnauthorizedError ||
    (error instanceof AppError && error.statusCode === 401);
}
