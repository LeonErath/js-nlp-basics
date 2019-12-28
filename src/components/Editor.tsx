import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Node, Range } from "slate";
import { Editable, RenderLeafProps, Slate, withReact } from "slate-react";
import styled from "styled-components";
import Toolbar from "./Toolbar";
import { TagColors, Tag } from "./Tag";
import HoveringMenu from "./HoveringMenu";

const Container = styled.div``;

const EditorDiv = styled.div`
	min-height: 400px;
	border: 1px solid #d9d9d9;
	padding: 16px;
	line-height: 2;
	border-radius: 4px;
`;

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
	if (leaf.highlight) {
		console.log(leaf.tag, TagColors.get(leaf.tag));

		return (
			<Tag {...attributes} background={TagColors.get(leaf.tag)}>
				{children}
			</Tag>
		);
	} else {
		return <span {...attributes}>{children}</span>;
	}
};

interface IProps {
	analyze: ([node, path]: any) => Range[];
}

const Editor: React.FC<IProps> = ({ analyze }) => {
	const editor = useMemo(() => withReact(createEditor()), []);

	const [value, setValue] = useState<Node[]>([
		{
			type: "paragraph",
			children: [{ text: "Some words" }]
		}
	]);

	const decorate = useCallback(analyze, []);

	return (
		<Container>
			<Slate editor={editor} value={value} onChange={value => setValue(value)}>
				<HoveringMenu></HoveringMenu>
				<Toolbar></Toolbar>
				<EditorDiv>
					<Editable
						decorate={decorate}
						renderLeaf={props => <Leaf {...props} />}
					/>
				</EditorDiv>
			</Slate>
		</Container>
	);
};

export default Editor;
