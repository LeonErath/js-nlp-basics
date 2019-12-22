import nlp from "compromise";
import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Node, Text, Range } from "slate";
import { Editable, Slate, withReact, RenderLeafProps } from "slate-react";
import styled from "styled-components";

const Container = styled.div`
	margin: 64px;
`;

const EditorDiv = styled.div`
	min-height: 400px;
	border-style: solid;
	border-width: 1px;
	border-color: black;
	padding: 16px;
	line-height: 2;
`;

const Button = styled.button`
	padding: 4px 8px;
	margin: 8px;
`;

interface TagProps {
	background: string | undefined;
}

const Tag = styled.span<TagProps>`
	background-color: ${props =>
		props.background ? props.background : "#ffffff"};
	border-radius: 4px;
	padding: 4px;
`;

const TagColors = new Map([
	["Noun", "#effffb"],
	["Modal", "#50d890"],
	["Singular", "#50d890"],
	["Pronoun", "#4f98ca"],
	["Determiner", "#e8d4b4"],
	["Preposition", "#e8d4b4"],
	["Verb", "#e8d4b4"],
	["Copula", "#ebe6e6"],
	["Adverb", "#e3f6f5"],
	["Comparable", "#bae8e8"],
	["Adjective", "#ffbd69"],
	["Negative", "#ffffff"],
	["Infinitive", "#effffb"],
	["QuestionWord", "#effffb"],
	["Negative", "#50d890"],
	["Possessive", "#4f98ca"],
	["Conjunction", "#e8d4b4"],
	["Adjective", "#ffbd69"],
	["Negative", "#ffffff"],
	["Participle", "#effffb"],
	["TitleCase", "#50d890"],
	["PresentTense", "#50d890"]
]);

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

const App: React.FC = () => {
	const editor = useMemo(() => withReact(createEditor()), []);

	const [value, setValue] = useState<Node[]>([
		{
			type: "paragraph",
			children: [{ text: "Some words" }]
		}
	]);

	const decorate = useCallback(([node, path]) => {
		let ranges: Range[] = [];

		if (Text.isText(node)) {
			const { text } = node;
			const terms = (nlp(text)
				.terms()
				.out("offsets") as unknown) as Array<any>;

			terms.forEach((term: any) => {
				ranges = [
					...ranges,
					{
						anchor: { path, offset: term.offset.start },
						focus: { path, offset: term.offset.start + term.offset.length },
						highlight: true,
						tag: term.terms[0].tags[0]
					}
				];
			});
		}

		return ranges;
	}, []);

	return (
		<Container>
			<h1>Hello World</h1>
			<Slate editor={editor} value={value} onChange={value => setValue(value)}>
				<div>
					<Button>Click me</Button>
				</div>
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

export default App;
