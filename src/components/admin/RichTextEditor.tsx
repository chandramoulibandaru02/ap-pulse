"use client";

import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Lightweight rich text editor using contentEditable.
 * Uses document.execCommand for basic formatting (bold, italic, headings, lists, blockquote).
 * No external dependencies needed — keeps bundle small.
 */
export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Set initial content only once
  useEffect(() => {
    if (editorRef.current && !initialized.current) {
      editorRef.current.innerHTML = value;
      initialized.current = true;
    }
  }, [value]);

  function execCmd(command: string, value?: string) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }

  function handleInput() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  const tools = [
    { label: "B", title: "Bold", cmd: () => execCmd("bold"), class: "font-bold" },
    { label: "I", title: "Italic", cmd: () => execCmd("italic"), class: "italic" },
    { label: "H2", title: "Heading 2", cmd: () => execCmd("formatBlock", "<h2>"), class: "" },
    { label: "H3", title: "Heading 3", cmd: () => execCmd("formatBlock", "<h3>"), class: "" },
    { label: "¶", title: "Paragraph", cmd: () => execCmd("formatBlock", "<p>"), class: "" },
    { label: "• List", title: "Bullet list", cmd: () => execCmd("insertUnorderedList"), class: "" },
    { label: "1. List", title: "Numbered list", cmd: () => execCmd("insertOrderedList"), class: "" },
    { label: '" Quote', title: "Blockquote", cmd: () => execCmd("formatBlock", "<blockquote>"), class: "" },
    { label: "Link", title: "Insert link", cmd: () => {
      const url = prompt("Enter URL:");
      if (url) execCmd("createLink", url);
    }, class: "" },
    { label: "✕ Link", title: "Remove link", cmd: () => execCmd("unlink"), class: "" },
  ];

  return (
    <div className="border border-[#e5e5e5] rounded">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-[#e5e5e5] bg-[#f7f6f4]">
        {tools.map((tool) => (
          <button
            key={tool.title}
            type="button"
            title={tool.title}
            onClick={tool.cmd}
            className={`px-2.5 py-1 text-xs border border-[#e5e5e5] bg-white hover:border-[#c0392b] hover:text-[#c0392b] transition-colors ${tool.class}`}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        className="min-h-[300px] p-4 text-sm leading-relaxed focus:outline-none article-body"
        style={{ maxWidth: "100%" }}
        role="textbox"
        aria-multiline="true"
        aria-label="Article content editor"
      />
    </div>
  );
}
