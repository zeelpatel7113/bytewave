"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Highlight from '@tiptap/extension-highlight'
import { ListItem } from "@tiptap/extension-list";
import { useEffect } from "react";

const Tiptap = ({onChange, value}) => {
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3",
      },
    },
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal",
          },
        },
      }),
      
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      ListItem,
      Heading,
    ],
    content: value,
  });


  // When content changes, notify parent
  useEffect(() => {
    if (!editor) return;
    const updateHandler = () => {
      onChange?.(editor.getHTML()); // pass HTML string to parent
    };
    editor.on("update", updateHandler);
    return () => editor.off("update", updateHandler);
  }, [editor, onChange]);

  if (!editor) return null;

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
