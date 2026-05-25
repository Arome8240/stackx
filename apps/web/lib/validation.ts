import { MAX_CAST_LENGTH, MAX_POLL_OPTIONS, MIN_POLL_OPTIONS, CHANNEL_NAME_REGEX, SUPPORTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from './constants';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateCastContent(content: string): ValidationResult {
  if (!content.trim()) return { valid: false, error: 'Cast cannot be empty' };
  if (content.length > MAX_CAST_LENGTH) return { valid: false, error: `Cast cannot exceed ${MAX_CAST_LENGTH} characters` };
  return { valid: true };
}

export function validatePollOptions(options: string[]): ValidationResult {
  if (options.length < MIN_POLL_OPTIONS) return { valid: false, error: `At least ${MIN_POLL_OPTIONS} options required` };
  if (options.length > MAX_POLL_OPTIONS) return { valid: false, error: `Maximum ${MAX_POLL_OPTIONS} options allowed` };
  for (const opt of options) {
    if (!opt.trim()) return { valid: false, error: 'All poll options must be non-empty' };
    if (opt.length > 100) return { valid: false, error: 'Poll option cannot exceed 100 characters' };
  }
  const unique = new Set(options.map((o) => o.trim().toLowerCase()));
  if (unique.size !== options.length) return { valid: false, error: 'Poll options must be unique' };
  return { valid: true };
}

export function validateChannelName(name: string): ValidationResult {
  if (!CHANNEL_NAME_REGEX.test(name)) {
    return { valid: false, error: 'Channel name must be 3-32 lowercase letters, numbers, or hyphens' };
  }
  return { valid: true };
}

export function validateImageFile(file: File): ValidationResult {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: `Unsupported file type. Allowed: ${SUPPORTED_IMAGE_TYPES.join(', ')}` };
  }
  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > MAX_IMAGE_SIZE_MB) {
    return { valid: false, error: `File size must not exceed ${MAX_IMAGE_SIZE_MB}MB` };
  }
  return { valid: true };
}

export function validateStxAmount(amount: number | string): ValidationResult {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(n) || n <= 0) return { valid: false, error: 'Amount must be a positive number' };
  if (n < 0.000001) return { valid: false, error: 'Amount too small (minimum 1 microSTX)' };
  return { valid: true };
}

export function validateUrl(url: string): ValidationResult {
  if (!url) return { valid: true };
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}
