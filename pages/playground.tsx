import React, { useState } from "react";

import { Text, Range } from "slate";
import nlp from "compromise";
import { Select } from "antd";
import styled from "styled-components";
import Editor from "../components/tagging";
import Word2VecEditor from "../components/word2vec";

const { Option } = Select;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	margin: 64px;
	max-width: 1000px;
	@media (max-width: 768px) {
		margin: 32px;
	}
`;

const Playground = () => {
	const [current, setCurrent] = useState("word2vec");

	function handleChange(value: string) {
		setCurrent(value);
	}

	const analyze = ([node, path]: any) => {
		let ranges: Range[] = [];

		if (Text.isText(node)) {
			const { text } = node;
			const terms = (nlp(text)
				.terms()
				.out("tags") as unknown) as Array<any>;
			// terms.forEach((term: any) => {
			// 	ranges = [
			// 		...ranges,
			// 		{
			// 			anchor: { path, offset: term.offset.start },
			// 			focus: { path, offset: term.offset.start + term.offset.length },
			// 			highlight: true,
			// 			tag: term.terms[0].tags[0]
			// 		}
			// 	];
			// });
		}

		return ranges;
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				alignItems: "center"
			}}>
			<Container>
				<Select
					defaultValue={current}
					style={{ width: 120 }}
					onChange={handleChange}>
					<Option value="tagging" disabled>
						Tagging
					</Option>
					<Option value="word2vec">Word2Vec</Option>
				</Select>

				{current === "tagging" && <Editor analyze={analyze}></Editor>}
				{current === "word2vec" && <Word2VecEditor></Word2VecEditor>}
			</Container>
		</div>
	);
};

export default Playground;
