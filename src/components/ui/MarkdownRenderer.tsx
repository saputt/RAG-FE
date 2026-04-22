import React, { useEffect, useRef } from "react";

// ─── KaTeX helpers ────────────────────────────────────────────────────────────

declare global {
  interface Window {
    katex?: {
      renderToString: (tex: string, opts?: object) => string;
    };
  }
}

const renderKatex = (tex: string, displayMode = false): string => {
  if (!window.katex) return tex;
  try {
    return window.katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      output: "htmlAndMathml",
    });
  } catch {
    return tex;
  }
};

/** Inline math: $...$ */
const MathInline: React.FC<{ tex: string }> = ({ tex }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = renderKatex(tex, false);
  }, [tex]);
  return <span ref={ref} className="inline-block align-middle" />;
};

/** Block / display math: $$...$$ */
const MathBlock: React.FC<{ tex: string }> = ({ tex }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = renderKatex(tex, true);
  }, [tex]);
  return <div ref={ref} className="overflow-x-auto py-2 text-center" />;
};

// ─── Inline markdown parser ───────────────────────────────────────────────────

interface Props {
  content: string;
  className?: string;
}

/**
 * Renders inline markdown including:
 * - Inline math  $...$
 * - **bold**, *italic*, `code`
 */
const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  // Order matters: check $...$ before *  to avoid conflict
  const regex = /(\$([^$\n]+?)\$|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));

    const key = `${keyPrefix}-${match.index}`;
    if (match[2] !== undefined) {
      // inline math $...$
      nodes.push(<MathInline key={key} tex={match[2]} />);
    } else if (match[3] !== undefined) {
      // **bold**
      nodes.push(
        <strong key={key} className="font-semibold text-gray-900">
          {match[3]}
        </strong>
      );
    } else if (match[4] !== undefined) {
      // *italic*
      nodes.push(<em key={key}>{match[4]}</em>);
    } else if (match[5] !== undefined) {
      // `code`
      nodes.push(
        <code
          key={key}
          className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-[0.8em] font-mono"
        >
          {match[5]}
        </code>
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};

// ─── Block renderer ───────────────────────────────────────────────────────────

/**
 * Lightweight markdown + LaTeX renderer for AI chat responses.
 *
 * Block-level support:
 *   - Display math   $$...$$  (multi-line)
 *   - Headings       # ## ###
 *   - Unordered list - * •
 *   - Ordered list   1. 2. ...
 *   - Horizontal rule --- *** ___
 *   - Paragraphs
 *
 * Inline support:
 *   - Inline math  $...$
 *   - **bold**  *italic*  `code`
 */
const MarkdownRenderer: React.FC<Props> = ({ content, className = "" }) => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (trimmed === "") {
      i++;
      continue;
    }

    // ── Display math block  $$...$$ ──────────────────────────────────────────
    if (trimmed.startsWith("$$")) {
      const mathLines: string[] = [];
      // could be $$expr$$ on one line, or multiline
      const oneLiner = trimmed.slice(2).replace(/\$\$$/, "").trim();
      if (oneLiner && trimmed.endsWith("$$") && trimmed.length > 4) {
        elements.push(<MathBlock key={`mb-${i}`} tex={oneLiner} />);
        i++;
        continue;
      }
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("$$")) {
        mathLines.push(lines[i]);
        i++;
      }
      i++; // skip closing $$
      elements.push(<MathBlock key={`mb-${i}`} tex={mathLines.join("\n")} />);
      continue;
    }

    // ── Horizontal rule ──────────────────────────────────────────────────────
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      elements.push(<hr key={`hr-${i}`} className="my-3 border-gray-200" />);
      i++;
      continue;
    }

    // ── Heading # ## ### ─────────────────────────────────────────────────────
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const cls =
        level === 1
          ? "text-base font-bold text-gray-900 mt-4 mb-1"
          : level === 2
          ? "text-sm font-bold text-gray-900 mt-3 mb-1"
          : "text-sm font-semibold text-gray-700 mt-2 mb-0.5";
      elements.push(
        <p key={`h-${i}`} className={cls}>
          {renderInline(text, `h-${i}`)}
        </p>
      );
      i++;
      continue;
    }

    // ── Unordered list ───────────────────────────────────────────────────────
    if (/^[-*•]\s+/.test(trimmed)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^[-*•]\s+/, "");
        items.push(
          <li key={`li-${i}`} className="flex gap-2 leading-relaxed">
            <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
            <span>{renderInline(itemText, `li-${i}`)}</span>
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 my-1.5 pl-1">
          {items}
        </ul>
      );
      continue;
    }

    // ── Ordered list ─────────────────────────────────────────────────────────
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: React.ReactNode[] = [];
      let num = 1;
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^\d+\.\s+/, "");
        items.push(
          <li key={`oli-${i}`} className="flex gap-2 leading-relaxed">
            <span className="flex-shrink-0 font-semibold text-gray-500 min-w-[1.2em] text-right">
              {num}.
            </span>
            <span>{renderInline(itemText, `oli-${i}`)}</span>
          </li>
        );
        i++;
        num++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-1.5 my-1.5 pl-1">
          {items}
        </ol>
      );
      continue;
    }

    // ── Paragraph ────────────────────────────────────────────────────────────
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,3}\s/.test(lines[i].trim()) &&
      !/^[-*•]\s/.test(lines[i].trim()) &&
      !/^\d+\.\s/.test(lines[i].trim()) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith("$$")
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }
    if (paragraphLines.length > 0) {
      elements.push(
        <p key={`p-${i}`} className="leading-relaxed">
          {renderInline(paragraphLines.join(" "), `p-${i}`)}
        </p>
      );
    }
  }

  return (
    <div className={`text-sm text-gray-800 space-y-1.5 ${className}`}>
      {elements}
    </div>
  );
};

export default MarkdownRenderer;
