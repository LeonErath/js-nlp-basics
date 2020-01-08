import React from "react";
import { Input, Button, Empty, Table } from "antd";
import styled from "styled-components";
import { SimilarWord } from "../models";

interface Props {
	loading: boolean;
	mathWord1: string;
	mathWord2: string;
	mathWord3: string;
	onWord1Change: (v: string) => void;
	onWord2Change: (v: string) => void;
	onWord3Change: (v: string) => void;
	calculate: () => void;
	similarWords2: SimilarWord[];
}

const Text = styled.div`
	display: flex;
	width: 80%;
	font-size: "16px";
	@media (max-width: 768px) {
		width: 100%;
	}
`;

const Symbol = styled.div`
	margin: 8px;
	font-size: 20px;
	font-weight: bold;
`;

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

const WordAlgebra = ({
	loading,
	mathWord1,
	mathWord2,
	mathWord3,
	similarWords2,
	calculate,
	onWord1Change,
	onWord2Change,
	onWord3Change
}: Props) => {
	return (
		<div>
			<div style={{ marginTop: "64px", marginBottom: "32px" }}>
				<div
					style={{
						display: "flex",
						width: "80%",
						fontSize: "22px",
						marginBottom: "16px"
					}}>
					Word Algebra
				</div>
				<Text>
					A curious phenomenon identified amongst word embeddings of Word2Vec
					and Glove, is that analogies, e.g. "man is to king as woman is to
					...?" or "Paris is to France as Rome is to ...?", can often be solved
					simply by adding and subtracting embeddings. Try it out now!
				</Text>
			</div>
			<div
				style={{
					display: "flex",
					width: "100%",
					marginTop: "16px",
					alignItems: "center",
					flexWrap: "wrap"
				}}>
				<Input
					disabled={loading}
					value={mathWord1}
					style={{ width: "100%", maxWidth: "200px", minWidth: "100px" }}
					placeholder="Germany"
					onChange={e => onWord1Change(e.target.value)}
				/>

				<Symbol>+</Symbol>
				<Symbol>(</Symbol>
				<Input
					disabled={loading}
					value={mathWord2}
					style={{ width: "100%", maxWidth: "200px", minWidth: "100px" }}
					placeholder="Paris"
					onChange={e => onWord2Change(e.target.value)}
				/>
				<Symbol>-</Symbol>
				<Input
					disabled={loading}
					value={mathWord3}
					style={{
						marginRight: "8px",
						width: "100%",
						maxWidth: "200px",
						minWidth: "100px"
					}}
					placeholder="France"
					onChange={e => onWord3Change(e.target.value)}
				/>
				<Symbol>)</Symbol>
				<Button disabled={loading} onClick={calculate}>
					Calculate
				</Button>
			</div>
			{similarWords2.length === 0 && (
				<Empty style={{ marginTop: "64px" }}></Empty>
			)}
			{similarWords2.length !== 0 && (
				<Table
					dataSource={similarWords2}
					columns={columns}
					bordered
					size="middle"
					style={{ marginTop: "16px" }}></Table>
			)}
		</div>
	);
};

export default WordAlgebra;
