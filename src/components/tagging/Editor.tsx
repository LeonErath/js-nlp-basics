import React, { useMemo, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import styled from "styled-components";

const StyledEditor = styled.div`
  border: 1px solid red;
  padding: 8px;
`;

export const Editor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);

  return (
    <StyledEditor>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <Editable />
      </Slate>
    </StyledEditor>
  );
};
