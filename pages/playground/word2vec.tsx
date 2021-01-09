import React, { useState } from "react";

import { Text, Range } from "slate";
import nlp from "compromise";
import { Select } from "antd";
import styled from "styled-components";
import Word2VecEditor from "../../components/word2vec";

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

const word2vec = () => {
	const [current, setCurrent] = useState("word2vec");

	function handleChange(value: string) {
		setCurrent(value);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				alignItems: "center",
			}}>
			<Container>
				<Word2VecEditor></Word2VecEditor>
			</Container>
		</div>
	);
};

export default word2vec;
