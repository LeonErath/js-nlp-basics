import React, { useState } from "react";
import styled from "styled-components";
import word2vec from "../Word2Vec";
import { Input, Button, Table, Empty } from "antd";

const columns = [
	{
		title: "Word",
		dataIndex: "word"
	},
	{
		title: "Distance",
		dataIndex: "distance"
	}
];

const Container = styled.div`
	margin-top: 16px;
`;

const wordVectors = word2vec();

interface SimilarWord {
	word: string;
	distance: number;
}

const Word2VecEditor = () => {
	const [word, setWord] = useState("");
	const [similarWords, setSimilarWords] = useState<SimilarWord[]>([]);

	const getNearestVectors = () => {
		wordVectors
			.nearest(word)
			.then((result: SimilarWord[] | null) => {
				if (result) {
					setSimilarWords(result);
				} else {
					setSimilarWords([]);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
	};

	return (
		<Container>
			<div style={{ display: "flex", width: "100%" }}>
				<Input
					onKeyDown={e => {
						if (e.key === "Enter") {
							getNearestVectors();
						}
					}}
					style={{ marginRight: "8px" }}
					placeholder="Type a word..."
					onChange={e => setWord(e.target.value)}
				/>
				<Button onClick={getNearestVectors}>Calculate</Button>
			</div>
			{similarWords.length === 0 && (
				<Empty style={{ marginTop: "32px" }}></Empty>
			)}
			{similarWords.length !== 0 && (
				<Table
					dataSource={similarWords}
					columns={columns}
					bordered
					size="middle"
					style={{ marginTop: "16px" }}></Table>
			)}
		</Container>
	);
};

export default Word2VecEditor;
