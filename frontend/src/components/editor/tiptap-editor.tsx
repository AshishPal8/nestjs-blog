"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";

import { Button } from "@/src/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Heading1,
} from "lucide-react";

interface PostEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function PostEditor({ value, onChange }: PostEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({ levels: [1, 2] }),
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter link");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-muted/40 p-2 flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Button size="sm" variant="ghost" onClick={addLink}>
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Floating bubble menu (double click text) */}
      <BubbleMenu
        editor={editor}
        options={{ placement: "top", offset: 8, flip: true }}
      >
        <div className="flex gap-1 bg-white shadow-md border rounded-md p-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        </div>
      </BubbleMenu>

      <EditorContent
        editor={editor}
        className="p-4 min-h-[250px] prose max-w-none"
      />
    </div>
  );
}
