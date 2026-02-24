"use client";

import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function RichEditor({
  value,
  onChange,
}: Props) {
  return (
    <RichTextEditor
      immediatelyRender={false}
      extensions={[StarterKit]}
      content={value || ""}
      onUpdate={({ editor }) =>
        onChange(editor.getHTML())
      }
      renderControls={() => (
        <MenuControlsContainer>
          <MenuSelectHeading />
          <MenuDivider />
          <MenuButtonBold />
          <MenuButtonItalic />
        </MenuControlsContainer>
      )}
    />
  );
}