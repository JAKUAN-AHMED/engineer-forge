'use client';

/**
 * Tiny, dependency-free markdown renderer tailored to our lesson content.
 * Supports: # / ## / ### headings, **bold**, *italic*, inline `code`,
 * fenced ```code``` blocks, unordered - lists, ordered 1. lists, paragraphs.
 * This is intentionally simple; for richer content we'll switch to MDX later.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(line: string): string {
  let out = escapeHtml(line);
  // inline code first
  out = out.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  // bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // italic
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return out;
}

function renderBlocks(src: string): string {
  const lines = src.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? '';
    if (line.startsWith('```')) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? '').startsWith('```')) {
        buf.push(lines[i] ?? '');
        i++;
      }
      i++; // skip closing ```
      out.push(`<pre>${escapeHtml(buf.join('\n'))}</pre>`);
      continue;
    }
    if (/^###\s+/.test(line)) { out.push(`<h3>${renderInline(line.replace(/^###\s+/, ''))}</h3>`); i++; continue; }
    if (/^##\s+/.test(line))  { out.push(`<h2>${renderInline(line.replace(/^##\s+/, ''))}</h2>`);  i++; continue; }
    if (/^#\s+/.test(line))   { out.push(`<h1>${renderInline(line.replace(/^#\s+/, ''))}</h1>`);   i++; continue; }
    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i] ?? '')) {
        items.push(`<li>${renderInline((lines[i] ?? '').replace(/^\s*-\s+/, ''))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i] ?? '')) {
        items.push(`<li>${renderInline((lines[i] ?? '').replace(/^\s*\d+\.\s+/, ''))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }
    if (/^>\s*/.test(line)) {
      out.push(`<blockquote>${renderInline(line.replace(/^>\s*/, ''))}</blockquote>`);
      i++;
      continue;
    }
    if (line.trim() === '') {
      i++;
      continue;
    }
    // paragraph: accumulate adjacent non-empty lines
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      (lines[i] ?? '').trim() !== '' &&
      !/^(```|#{1,3}\s|\s*-\s|\s*\d+\.\s|>\s)/.test(lines[i] ?? '')
    ) {
      buf.push(lines[i] ?? '');
      i++;
    }
    out.push(`<p>${renderInline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}

export function Markdown({ source, inline = false }: { source: string; inline?: boolean }) {
  if (inline) {
    return <span dangerouslySetInnerHTML={{ __html: renderInline(source) }} />;
  }
  return <div dangerouslySetInnerHTML={{ __html: renderBlocks(source) }} />;
}
