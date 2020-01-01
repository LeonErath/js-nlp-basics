import React, { useState, useEffect } from "react";
import styled from "styled-components";
import word2vec from "../../Word2Vec";
import {
	Input,
	Button,
	Table,
	Empty,
	InputNumber,
	Spin,
	Select,
	message,
	Statistic,
	Row,
	Col
} from "antd";
import { SimilarWord } from "../../models";
import models from "./models.json";

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

const Word2VecEditor = () => {
	const [word, setWord] = useState("");
	const [mathWord1, setMathWord1] = useState("");
	const [mathWord2, setMathWord2] = useState("");
	const [mathWord3, setMathWord3] = useState("");

	const [modelIndex, setModelIndex] = useState(
		models.findIndex(m => m.short_name === "ml5_medium")
	);
	const [loading, setLoading] = useState(false);

	const [max, setMax] = useState(10);
	const [similarWords, setSimilarWords] = useState<SimilarWord[]>([]);
	const [similarWords2, setSimilarWords2] = useState<SimilarWord[]>([]);

	useEffect(() => {
		setLoading(true);

		wordVectors
			.dispose()
			.loadModel(models[modelIndex].url)
			.then(() => {
				reset();

				setLoading(false);
			})
			.catch(e => {
				console.log(e);
			});
	}, [modelIndex]);

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
		setModelIndex(models.findIndex(m => m.short_name === e));
	};

	return (
		<Container>
			<div style={{ display: "flex", width: "100%", alignItems: "center" }}>
				<Select
					defaultValue={models[modelIndex].short_name}
					style={{ width: 200 }}
					onChange={handleModelChange}>
					{models.map(m => {
						return (
							<Option disabled={m.disable} value={m.short_name}>
								{m.name}
							</Option>
						);
					})}
				</Select>
				{loading && <Spin style={{ marginLeft: "8px" }}></Spin>}
			</div>

			<div style={{ marginTop: "32px", marginBottom: "32px" }}>
				<Row
					gutter={16}
					style={{
						display: "flex",
						width: "100%",
						alignItems: "center",
						marginBottom: "64px"
					}}>
					<Col span={8} style={{ marginRight: "8px" }}>
						<Statistic title="Model" value={models[modelIndex].name} />
					</Col>
					<Col span={4} style={{ marginRight: "8px" }}>
						<Statistic title="Words/Vectors" value={wordVectors.modelSize} />
					</Col>
					<Col span={4}>
						<Statistic
							title="Dimensions"
							value={wordVectors.vectorDimensions}
						/>
					</Col>
				</Row>
				<div
					style={{
						display: "flex",
						width: "80%",
						fontSize: "22px",
						marginBottom: "16px"
					}}>
					Word Embeddings
				</div>
				<div style={{ display: "flex", width: "80%", fontSize: "16px" }}>
					The embeddings you have trained will now be displayed. You can search
					for words to find their closest neighbors. For example, try searching
					for "beautiful". You may see neighbors like "wonderful".
				</div>
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
					style={{ marginRight: "8px", maxWidth: "400px" }}
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
				<Empty style={{ marginTop: "64px" }}></Empty>
			)}

			{similarWords.length !== 0 && (
				<Table
					dataSource={similarWords}
					columns={columns}
					bordered
					size="middle"
					style={{ marginTop: "16px" }}></Table>
			)}
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
				<div style={{ display: "flex", width: "80%", fontSize: "16px" }}>
					A curious phenomenon identified amongst word embeddings of Word2Vec
					and Glove, is that analogies, e.g. "man is to king as woman is to
					...?" or "Paris is to France as Rome is to ...?", can often be solved
					simply by adding and subtracting embeddings. Try it out now!
				</div>
			</div>
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
		</Container>
	);
};

export default Word2VecEditor;
