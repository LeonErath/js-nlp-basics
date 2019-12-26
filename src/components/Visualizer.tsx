import React from "react";
import Editor from "./Editor";
import { Text, Range } from "slate";
import nlp from "compromise";

const Visualizer = () => {
	const analyze = ([node, path]: any) => {
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
	};

	return <Editor analyze={analyze}></Editor>;
};

export default Visualizer;
