export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[a-zA-Z][a-zA-Z0-9_]{0,49}/g);
  if (!matches) return [];
  return [...new Set(matches.map((t) => t.toLowerCase()))];
}

export function extractMentions(text: string): string[] {
  const matches = text.match(/@[a-z][a-z0-9_]{0,31}/gi);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(1).toLowerCase()))];
}

export function highlightHashtags(text: string): string {
  return text.replace(/#[a-zA-Z][a-zA-Z0-9_]{0,49}/g, '<span class="hashtag">$&</span>');
}

export function highlightMentions(text: string): string {
  return text.replace(/@[a-z][a-z0-9_]{0,31}/gi, '<span class="mention">$&</span>');
}

export function normalizeHashtag(tag: string): string {
  return tag.replace(/^#/, '').toLowerCase().trim();
}
