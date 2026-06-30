/**
 * InlineEditContext — enables click-to-edit text on the canvas.
 * ------------------------------------------------------------------
 * Sections read from this context to decide whether to render text as
 * static or as a contentEditable span. The context provides:
 *   - enabled: whether inline editing is active (design mode)
 *   - onCommit(sectionId, propPath, newValue): commit a text change
 */
"use client";

import * as React from "react";

interface InlineEditCtx {
  enabled: boolean;
  onCommit: (sectionId: string, propPath: string, value: string) => void;
}

const InlineEditContext = React.createContext<InlineEditCtx>({
  enabled: false,
  onCommit: () => {},
});

export function InlineEditProvider({
  enabled,
  onCommit,
  children,
}: {
  enabled: boolean;
  onCommit: (sectionId: string, propPath: string, value: string) => void;
  children: React.ReactNode;
}) {
  const ctx = React.useMemo(() => ({ enabled, onCommit }), [enabled, onCommit]);
  return <InlineEditContext.Provider value={ctx}>{children}</InlineEditContext.Provider>;
}

export function useInlineEdit() {
  return React.useContext(InlineEditContext);
}

/**
 * EditableText — renders as a contentEditable span when inline editing
 * is enabled, otherwise as a plain wrapper.
 */
export function EditableText({
  sectionId,
  propPath,
  value,
  as: Tag = "span",
  className,
  style,
  children,
}: {
  sectionId: string;
  propPath: string;
  value: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const { enabled, onCommit } = useInlineEdit();
  const ref = React.useRef<HTMLElement>(null);
  const [editing, setEditing] = React.useState(false);

  if (!enabled) {
    return <Tag className={className} style={style}>{children ?? value}</Tag>;
  }

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={`${className ?? ""} ${editing ? "outline outline-2 outline-[#6d5efc] outline-offset-2 rounded" : "hover:outline hover:outline-1 hover:outline-[#6d5efc]/40 hover:outline-offset-2 hover:rounded cursor-text"}`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      onFocus={() => setEditing(true)}
      onBlur={() => {
        setEditing(false);
        const newText = ref.current?.textContent ?? "";
        if (newText !== value && newText.trim().length > 0) {
          onCommit(sectionId, propPath, newText);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
        if (e.key === "Escape") {
          if (ref.current) ref.current.textContent = value;
          (e.target as HTMLElement).blur();
        }
      }}
    >
      {children ?? value}
    </Tag>
  );
}
