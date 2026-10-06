import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownViewProps {
  content: string;
  className?: string;
  inline?: boolean;
}

/**
 * Safe, lightweight Markdown parser supporting:
 * - **bold** / __bold__
 * - *italic* / _italic_
 * - `inline code`
 * - Fenced code blocks ```
 * - Blockquotes >
 * - Unordered lists - or *
 * - Ordered lists 1.
 * - Line breaks
 */
export const MarkdownView: React.FC<MarkdownViewProps> = ({
  content,
  className,
  inline = false,
}) => {
  if (!content) return null;

  // Helper to parse inline tokens (bold, italic, code) safely
  const parseInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // 1. Inline code: `code`
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        parts.push(
          <code
            key={key++}
            className="font-mono text-[0.85em] bg-[var(--color-panel-elevated)] text-[var(--color-burgundy-soft)] px-1.5 py-0.5 rounded border border-[var(--color-border-subtle)]"
          >
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // 2. Bold: **text** or __text__
      const boldMatch = remaining.match(/^(\*\*|__)(.+?)\1/);
      if (boldMatch) {
        parts.push(
          <strong key={key++} className="font-bold text-[var(--color-soft-white)]">
            {parseInline(boldMatch[2])}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // 3. Italic: *text* or _text_
      const italicMatch = remaining.match(/^(\*|_)([^*_]+?)\1/);
      if (italicMatch) {
        parts.push(
          <em key={key++} className="italic text-[var(--color-steel)]">
            {parseInline(italicMatch[2])}
          </em>
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Regular text chunk up to the next potential token
      const nextTokenIndex = remaining.search(/[`*_]/);
      if (nextTokenIndex === -1) {
        parts.push(remaining);
        break;
      } else if (nextTokenIndex > 0) {
        parts.push(remaining.slice(0, nextTokenIndex));
        remaining = remaining.slice(nextTokenIndex);
      } else {
        // Stray character that didn't match token pattern
        parts.push(remaining[0]);
        remaining = remaining.slice(1);
      }
    }

    return parts;
  };

  if (inline) {
    return <span className={cn('inline-block break-words', className)}>{parseInline(content)}</span>;
  }

  // Multiline / Block parser
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let blockquoteBuffer: string[] = [];
  let blockKey = 0;

  const flushList = () => {
    if (!listBuffer) return;
    if (listBuffer.type === 'ul') {
      elements.push(
        <ul key={blockKey++} className="list-disc list-inside space-y-1 my-2 text-sm text-[var(--color-steel)]">
          {listBuffer.items.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={blockKey++} className="list-decimal list-inside space-y-1 my-2 text-sm text-[var(--color-steel)]">
          {listBuffer.items.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ol>
      );
    }
    listBuffer = null;
  };

  const flushBlockquote = () => {
    if (blockquoteBuffer.length === 0) return;
    elements.push(
      <blockquote
        key={blockKey++}
        className="border-l-2 border-[var(--color-burgundy-soft)] pl-3 my-2 text-xs sm:text-sm text-[var(--color-muted-steel)] italic bg-[var(--color-panel-elevated)]/40 py-1.5 rounded-r"
      >
        {blockquoteBuffer.map((line, idx) => (
          <p key={idx}>{parseInline(line)}</p>
        ))}
      </blockquote>
    );
    blockquoteBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced Code Block: ```lang
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <pre
            key={blockKey++}
            className="my-3 p-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] overflow-x-auto text-left"
          >
            {codeLang && (
              <span className="block text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted-steel)] mb-1 pb-1 border-b border-[var(--color-border-subtle)]/50">
                {codeLang}
              </span>
            )}
            <code className="font-mono text-xs leading-relaxed text-[var(--color-soft-white)] block whitespace-pre">
              {codeBuffer.join('\n')}
            </code>
          </pre>
        );
        inCodeBlock = false;
        codeBuffer = [];
        codeLang = '';
      } else {
        // Start code block
        flushList();
        flushBlockquote();
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Blockquote: > text
    if (line.startsWith('>')) {
      flushList();
      blockquoteBuffer.push(line.replace(/^>\s?/, ''));
      continue;
    } else {
      flushBlockquote();
    }

    // Unordered List: - item or * item
    const ulMatch = line.match(/^[-*]\s+(.+)/);
    if (ulMatch) {
      if (!listBuffer || listBuffer.type !== 'ul') {
        flushList();
        listBuffer = { type: 'ul', items: [] };
      }
      listBuffer.items.push(ulMatch[1]);
      continue;
    }

    // Ordered List: 1. item
    const olMatch = line.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      if (!listBuffer || listBuffer.type !== 'ol') {
        flushList();
        listBuffer = { type: 'ol', items: [] };
      }
      listBuffer.items.push(olMatch[1]);
      continue;
    }

    flushList();

    // Regular paragraph or line break
    if (line.trim() === '') {
      elements.push(<div key={blockKey++} className="h-2" />);
    } else {
      elements.push(
        <p key={blockKey++} className="leading-relaxed">
          {parseInline(line)}
        </p>
      );
    }
  }

  flushList();
  flushBlockquote();

  // If unclosed code block at end of file
  if (inCodeBlock) {
    elements.push(
      <pre
        key={blockKey++}
        className="my-3 p-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] overflow-x-auto text-left"
      >
        <code className="font-mono text-xs leading-relaxed text-[var(--color-soft-white)] block whitespace-pre">
          {codeBuffer.join('\n')}
        </code>
      </pre>
    );
  }

  return <div className={cn('space-y-1 break-words', className)}>{elements}</div>;
};

