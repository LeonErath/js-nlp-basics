import React, { useMemo, useState, useCallback } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { Node, Text } from "slate";
import styled from "styled-components";
import nlp from "compromise";

const Container = styled.div`
	margin: 64px;
`;

const EditorDiv = styled.div`
	border-style: solid;
	border-width: 1px;
	border-color: black;
	padding: 16px;
`;

interface TagProps {
	background: string;
}

const Tag = styled.span<TagProps>`
	background-color: ${props => props.background};

	border-radius: 4px;
	padding: 4px;
`;

const TagColors = new Map([
	["Noun", "#effffb"],
	["Modal", "#50d890"],
	["Pronoun", "#4f98ca"],
	["Determiner", "#e8d4b4"],
	["Verb", "#e8d4b4"],
	["Copula", "#ebe6e6"],
	["Adverb", "#e3f6f5"],
	["Comparable", "#bae8e8"],
	["Adjective", "#ffbd69"],
	["Negative", "#ffffff"]
]);

const App: React.FC = () => {
	const editor = useMemo(() => withReact(createEditor()), []);

	const [value, setValue] = useState<Node[]>([
		{
			type: "paragraph",
			children: [{ text: "Some words" }]
		}
	]);

	const decorate = useCallback(
		([node, path]) => {
			const ranges: any = [];

			if (Text.isText(node)) {
				const { text } = node;
				const terms = nlp(text)
					.terms()
					.json();

				terms.forEach((term: any, index: number) => {
					const parts = text.split(term.text);
					let offset = 0;

					parts.forEach((part, i) => {
						if (i !== 0) {
							ranges.push({
								anchor: { path, offset: offset - term.text.length },
								focus: { path, offset },
								highlight: true,
								tag: term.terms[0].tags[0]
							});
						}

						offset = offset + part.length + term.text.length;
					});
				});
			}

			return ranges;
		},
		[value]
	);

	const Leaf = ({ attributes, children, leaf }: any) => {
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

	return (
		<Container>
			<h1>Hello World</h1>
			<EditorDiv>
				<Slate
					editor={editor}
					value={value}
					onChange={value => setValue(value)}>
					<Editable
						decorate={decorate}
						renderLeaf={props => <Leaf {...props} />}
					/>
				</Slate>
			</EditorDiv>
		</Container>
	);
};

export default App;
