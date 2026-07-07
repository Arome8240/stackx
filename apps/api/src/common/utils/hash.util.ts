import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

export function generateToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = Buffer.allocUnsafe(length);
  const crypto = require('crypto');
  crypto.randomFillSync(bytes);
  return Array.from(bytes).map((b: number) => chars[b % chars.length]).join('');
}

/** One-way hash for opaque tokens (e.g. password-reset tokens) so only the hash is ever stored at rest. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
