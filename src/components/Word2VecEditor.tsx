import React, { useState, useEffect } from "react";
import styled from "styled-components";
import word2vec from "../Word2Vec";
import {
	Input,
	Button,
	Table,
	Empty,
	InputNumber,
	Spin,
	Select,
	message
} from "antd";
import { SimilarWord } from "../models";

const { Option } = Select;

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

const Symbol = styled.div`
	margin: 8px;
	font-size: 20px;
	font-weight: bold;
`;

const wordVectors = word2vec();

const modelURLs = new Map([
	["wiki_ger", "/data/wikipedia_german.json"],
	["ml5_big", "/data/wordvecs10000.json"],
	["ml5_medium", "/data/wordvecs5000.json"],
	["ml5_small", "/data/wordvecs1000.json"]
]);

const Word2VecEditor = () => {
	const [word, setWord] = useState("");
	const [mathWord1, setMathWord1] = useState("");
	const [mathWord2, setMathWord2] = useState("");
	const [mathWord3, setMathWord3] = useState("");

	const defaultUrl = "ml5_small";
	const [modelUrl, setModelUrl] = useState(modelURLs.get(defaultUrl));
	const [loading, setLoading] = useState(false);

	const [max, setMax] = useState(10);
	const [similarWords, setSimilarWords] = useState<SimilarWord[]>([]);
	const [similarWords2, setSimilarWords2] = useState<SimilarWord[]>([]);

	useEffect(() => {
		setLoading(true);
		if (!modelUrl) {
			return;
		}
		wordVectors
			.dispose()
			.loadModel(modelUrl)
			.then(() => {
				reset();

				setLoading(false);
			})
			.catch(e => {
				console.log(e);
			});
	}, [modelUrl]);

	const reset = () => {
		setWord("");
		setMathWord1("");
		setMathWord2("");
		setMathWord3("");
		setMax(10);
		setSimilarWords([]);
		setSimilarWords2([]);
	};

	const calculate = async () => {
		if (
			mathWord1.length === 0 &&
			mathWord2.length === 0 &&
			mathWord3.length === 0
		) {
			setMathWord1("germany");
			setMathWord2("paris");
			setMathWord3("france");

			try {
				const subResult = await wordVectors.subtract(["paris", "france"]);
				const result = await wordVectors.add([subResult[0].word, "germany"]);
				setSimilarWords2(result);
			} catch (e) {
				console.log(e);

				message.info(`No results were found.`);
			}
		} else {
			try {
				const subResult = await wordVectors.subtract([mathWord2, mathWord3]);
				if (subResult) {
					const result = await wordVectors.add([subResult[0].word, mathWord1]);
					setSimilarWords2(result);
				}
			} catch (e) {
				console.log(e);

				message.info(`No results were found.`);
			}
		}
	};

	const getNearestVectors = async () => {
		if (word.length === 0) {
			const randomWord = await wordVectors.getRandomWord();

			if (randomWord) {
				setWord(randomWord);

				wordVectors
					.nearest(randomWord, max)
					.then((result: SimilarWord[]) => {
						setSimilarWords(result);
					})
					.catch((err: any) => {
						message.error("An error occurred.");
						console.log(err);
					});
			}
		} else {
			wordVectors
				.nearest(word, max)
				.then((result: SimilarWord[]) => {
					setSimilarWords(result);
					if (result.length === 0) {
						message.info(`No results were found.`);
					}
				})
				.catch((err: any) => {
					message.info(`No results were found.`);
					console.log(err);
				});
		}
	};

	const handleModelChange = (e: any) => {
		setModelUrl(modelURLs.get(e));
	};

	return (
		<Container>
			<div style={{ display: "flex", width: "100%", alignItems: "center" }}>
				<Select
					defaultValue={defaultUrl}
					style={{ width: 200 }}
					onChange={handleModelChange}>
					<Option value="wiki_ger">Wikipedia German</Option>
					<Option value="ml5_big">ML5JS Big English</Option>
					<Option value="ml5_medium">ML5JS Medium English</Option>
					<Option value="ml5_small">ML5JS Small English</Option>
				</Select>
				{loading && <Spin style={{ marginLeft: "8px" }}></Spin>}
			</div>
			<div style={{ display: "flex", width: "100%", marginTop: "16px" }}>
				<Input
					disabled={loading}
					onKeyDown={e => {
						if (e.key === "Enter") {
							getNearestVectors();
						}
					}}
					value={word}
					style={{ marginRight: "8px" }}
					placeholder="Type a word..."
					onChange={e => setWord(e.target.value)}
				/>
				<InputNumber
					disabled={loading}
					min={1}
					max={50}
					defaultValue={max}
					onChange={e => {
						if (e) {
							setMax(e);
						}
					}}
					style={{ marginRight: "8px" }}
				/>
				<Button onClick={getNearestVectors} disabled={loading}>
					Calculate
				</Button>
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
			<div
				style={{
					display: "flex",
					width: "100%",
					marginTop: "16px",
					alignItems: "center"
				}}>
				<Input
					disabled={loading}
					value={mathWord1}
					style={{ width: "200px" }}
					placeholder="Germany"
					onChange={e => setMathWord1(e.target.value)}
				/>

				<Symbol>+</Symbol>
				<Symbol>(</Symbol>
				<Input
					disabled={loading}
					value={mathWord2}
					style={{ width: "200px" }}
					placeholder="Paris"
					onChange={e => setMathWord2(e.target.value)}
				/>
				<Symbol>-</Symbol>
				<Input
					disabled={loading}
					value={mathWord3}
					style={{ marginRight: "8px", width: "200px" }}
					placeholder="France"
					onChange={e => setMathWord3(e.target.value)}
				/>
				<Symbol>)</Symbol>
				<Button disabled={loading} onClick={calculate}>
					Calculate
				</Button>
			</div>
			{similarWords2.length === 0 && (
				<Empty style={{ marginTop: "32px" }}></Empty>
			)}
			{similarWords2.length !== 0 && (
				<Table
					dataSource={similarWords2}
					columns={columns}
					bordered
					size="middle"
					style={{ marginTop: "16px" }}></Table>
			)}
		</Container>
	);
};

export default Word2VecEditor;
