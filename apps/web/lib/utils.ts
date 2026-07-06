import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(timestamp: string | number): string {
  const now = Date.now();
  const past = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp * 1000;
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 60)   return `${diffSec}s`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d`;
  const date = new Date(past);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000)    return `${(n / 1_000).toFixed(0)}K`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatSTX(microSTX: number): string {
  const stx = microSTX / 1_000_000;
  if (stx >= 1_000_000) return `${(stx / 1_000_000).toFixed(2)}M STX`;
  if (stx >= 1_000)     return `${(stx / 1_000).toFixed(2)}K STX`;
  if (stx >= 1)         return `${stx.toFixed(2)} STX`;
  return `${microSTX.toLocaleString()} μSTX`;
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 3) return address ?? '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function parseContent(text: string): Array<{ type: 'text' | 'mention' | 'hashtag' | 'link'; value: string }> {
  const parts: Array<{ type: 'text' | 'mention' | 'hashtag' | 'link'; value: string }> = [];
  const regex = /(@\w+)|(#\w+)|(https?:\/\/[^\s]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) });
    if (m[1]) parts.push({ type: 'mention', value: m[1] });
    else if (m[2]) parts.push({ type: 'hashtag', value: m[2] });
    else if (m[3]) parts.push({ type: 'link', value: m[3] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts;
}

export function ipfsToHttp(cid: string): string {
  if (!cid) return '/placeholder.svg';
  if (cid.startsWith('http')) return cid;
  return `https://cloudflare-ipfs.com/ipfs/${cid}`;
}

export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, ms: number): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator?.clipboard) return navigator.clipboard.writeText(text);
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  return Promise.resolve();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function blockHeightToDate(height: number, currentHeight: number): Date {
  const blocksBack = currentHeight - height;
  const msBack = blocksBack * 10 * 60 * 1000; // ~10 min per block
  return new Date(Date.now() - msBack);
}
