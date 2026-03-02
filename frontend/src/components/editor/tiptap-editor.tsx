"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/src/components/ui/input";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Check,
  X,
  Type,
} from "lucide-react";

// ─── Toolbar Button ───────────────────────────────────────────────────────────
const ToolbarButton = ({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault(); // keep editor selection alive
      onClick();
    }}
    className={`p-1.5 rounded transition-colors ${
      active
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    }`}
  >
    {children}
  </button>
);

// ─── Slash command items ──────────────────────────────────────────────────────
const SLASH_ITEMS = [
  {
    label: "Heading 1",
    description: "Large section heading",
    icon: <Heading1 className="h-4 w-4" />,
    command: (editor: any) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: "Heading 2",
    description: "Medium section heading",
    icon: <Heading2 className="h-4 w-4" />,
    command: (editor: any) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "Bold",
    description: "Make text bold",
    icon: <Bold className="h-4 w-4" />,
    command: (editor: any) => editor.chain().focus().toggleBold().run(),
  },
  {
    label: "Italic",
    description: "Make text italic",
    icon: <Italic className="h-4 w-4" />,
    command: (editor: any) => editor.chain().focus().toggleItalic().run(),
  },
  {
    label: "Underline",
    description: "Underline text",
    icon: <UnderlineIcon className="h-4 w-4" />,
    command: (editor: any) => editor.chain().focus().toggleUnderline().run(),
  },
  {
    label: "Normal text",
    description: "Clear formatting",
    icon: <Type className="h-4 w-4" />,
    command: (editor: any) =>
      editor.chain().focus().clearNodes().unsetAllMarks().run(),
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface PostEditorProps {
  value: string;
  onChange: (html: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function PostEditor({ value, onChange }: PostEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  // slash menu state
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [slashPos, setSlashPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const slashMenuRef = useRef<HTMLDivElement>(null);

  const filteredItems = SLASH_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(slashQuery.toLowerCase()),
  );

  // ── Slash command tiptap extension ────────────────────────────────────────
  const SlashExtension = Extension.create({
    name: "slashCommand",
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("slashCommand"),
          props: {
            handleKeyDown(view, event) {
              return false; // let React handle it via onKeyDown
            },
          },
        }),
      ];
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({ levels: [1, 2] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Start writing… type / for commands",
      }),
      SlashExtension,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());

      // detect slash command trigger
      const { state } = editor;
      const { from } = state.selection;
      const textBefore = state.doc.textBetween(
        Math.max(0, from - 50),
        from,
        "\n",
      );
      const slashMatch = textBefore.match(/\/(\w*)$/);

      if (slashMatch) {
        setSlashQuery(slashMatch[1]);
        setSlashIndex(0);
        setSlashOpen(true);

        // position menu near cursor
        const coords = editor.view.coordsAtPos(from);
        const wrapper = editorWrapperRef.current?.getBoundingClientRect();
        if (wrapper) {
          setSlashPos({
            top: coords.bottom - wrapper.top + 4,
            left: coords.left - wrapper.left,
          });
        }
      } else {
        setSlashOpen(false);
        setSlashQuery("");
      }
    },
  });

  // ── Click wrapper → focus editor (but not toolbar or slash menu) ──────────
  const handleWrapperClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".toolbar") || target.closest(".slash-menu")) return;
    editor?.chain().focus().run();
  };

  // ── Link: focus input when shown, pre-fill existing ───────────────────────
  useEffect(() => {
    if (showLinkInput) {
      // save selection before setTimeout clears it
      setTimeout(() => linkInputRef.current?.focus(), 30);
      const existing = editor?.getAttributes("link").href ?? "";
      setLinkUrl(existing);
    }
  }, [showLinkInput]);

  // ── Confirm link ──────────────────────────────────────────────────────────
  const confirmLink = useCallback(() => {
    if (!linkUrl.trim()) {
      editor?.chain().focus().unsetLink().run();
    } else {
      const href = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor?.chain().focus().setLink({ href }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const cancelLink = useCallback(() => {
    setShowLinkInput(false);
    setLinkUrl("");
    editor?.chain().focus().run();
  }, [editor]);

  const handleLinkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmLink();
    }
    if (e.key === "Escape") cancelLink();
  };

  // ── Slash menu: keyboard navigation ──────────────────────────────────────
  useEffect(() => {
    if (!slashOpen || !editor) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashIndex((i) => (i + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashIndex(
          (i) => (i - 1 + filteredItems.length) % filteredItems.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        applySlashItem(filteredItems[slashIndex]);
      } else if (e.key === "Escape") {
        setSlashOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [slashOpen, slashIndex, filteredItems]);

  // ── Apply slash command: delete /query then run ───────────────────────────
  const applySlashItem = (item: (typeof SLASH_ITEMS)[0]) => {
    if (!editor) return;
    const { state } = editor;
    const { from } = state.selection;
    const textBefore = state.doc.textBetween(
      Math.max(0, from - 50),
      from,
      "\n",
    );
    const slashMatch = textBefore.match(/\/(\w*)$/);
    if (slashMatch) {
      const deleteFrom = from - slashMatch[0].length;
      editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run();
    }
    item.command(editor);
    setSlashOpen(false);
    setSlashQuery("");
  };

  // ── Close slash menu on outside click ────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        slashMenuRef.current &&
        !slashMenuRef.current.contains(e.target as Node)
      ) {
        setSlashOpen(false);
      }
    };
    if (slashOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [slashOpen]);

  if (!editor) return null;

  return (
    <div
      ref={editorWrapperRef}
      className="relative border rounded-lg overflow-visible cursor-text"
      onClick={handleWrapperClick}
    >
      {/* ── Bubble Menu ──────────────────────────────────────────────────── */}
      <BubbleMenu
        editor={editor}
        options={{ placement: "top", offset: 8, flip: true }}
        shouldShow={({ editor, state }) => {
          // never show when link input is open
          if (showLinkInput) return false;
          const { empty } = state.selection;
          return !empty;
        }}
      >
        <div className="flex items-center gap-0.5 bg-white shadow-lg border rounded-lg p-1">
          <ToolbarButton
            title="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            title="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            title="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="w-px h-4 bg-border mx-0.5" />

          <ToolbarButton
            title="Heading 1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
          >
            <Heading1 className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            title="Heading 2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
          >
            <Heading2 className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="w-px h-4 bg-border mx-0.5" />

          {/* Link button in bubble — shows inline input */}
          <ToolbarButton
            title="Link"
            onClick={() => setShowLinkInput(true)}
            active={editor.isActive("link")}
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>
      </BubbleMenu>

      {/* ── Inline Link Input (portal-like, over bubble) ─────────────────── */}
      {showLinkInput && (
        <div
          className="absolute z-50 flex items-center gap-1 bg-white shadow-lg border rounded-lg p-1.5"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -120%)",
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={linkInputRef}
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={handleLinkKeyDown}
            placeholder="Paste or type a URL..."
            className="h-7 text-sm w-56 border-none shadow-none focus-visible:ring-0 px-1"
          />
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              confirmLink();
            }}
            className="p-1 rounded hover:bg-green-50 text-green-600 transition-colors"
            title="Confirm"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              cancelLink();
            }}
            className="p-1 rounded hover:bg-red-50 text-red-500 transition-colors"
            title="Cancel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Editor ───────────────────────────────────────────────────────── */}
      <EditorContent editor={editor} className="rich-text p-4 min-h-[300px]" />

      {/* ── Slash Command Menu ────────────────────────────────────────────── */}
      {slashOpen && filteredItems.length > 0 && (
        <div
          ref={slashMenuRef}
          className="slash-menu absolute z-50 bg-white border rounded-lg shadow-lg py-1 w-64"
          style={{ top: slashPos.top, left: slashPos.left }}
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide px-3 pt-1 pb-0.5 font-medium">
            Commands
          </p>
          {filteredItems.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applySlashItem(item);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                i === slashIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
            >
              <span className="shrink-0 text-muted-foreground">
                {item.icon}
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium leading-none">
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
