import React from "react";
import { Text, Range } from "slate";
import nlp from "compromise";
import styled from "styled-components";
import Editor from "../../components/tagging";

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

const posTagging = () => {
	const analyze = ([node, path]: any) => {
		let ranges: Range[] = [];

		if (Text.isText(node)) {
			const { text } = node;
			const terms = (nlp(text).terms().out("tags") as unknown) as Array<any>;
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
				alignItems: "center",
			}}>
			<Container>{/* <Editor analyze={analyze} /> */}</Container>
		</div>
	);
};

export default posTagging;
