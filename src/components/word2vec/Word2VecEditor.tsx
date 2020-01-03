import { message, Select, Spin, Tag } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import word2vec from "../../algorithms/Word2Vec";
import { SimilarWord } from "../../models";
import ModelInfo from "./ModelInfo";
import { models, DataPoint } from "./models";
import WordAlgebra from "./WordAlgebra";
import WordEmbeddings from "./WordEmbeddings";

const { Option } = Select;

const Container = styled.div`
	margin-top: 16px;
`;

const wordVectors = word2vec();

const Word2VecEditor = () => {
	const [word, setWord] = useState("");
	const [secondWord, setSecondWord] = useState<string[]>([]);
	const [similarWords, setSimilarWords] = useState<SimilarWord[]>([]);
	const [max, setMax] = useState(20);
	const [graphData, setGraphData] = useState<DataPoint[]>([]);

	const [mathWord1, setMathWord1] = useState("");
	const [mathWord2, setMathWord2] = useState("");
	const [mathWord3, setMathWord3] = useState("");

	const [modelIndex, setModelIndex] = useState(
		models.findIndex(m => m.short_name === "ml5_medium")
	);
	const [loading, setLoading] = useState(false);

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
				message.error(`An error occurred.`);
				setLoading(false);
				console.log(e);
			});
	}, [modelIndex]);

	const reset = () => {
		setWord("");
		setMathWord1("");
		setMathWord2("");
		setMathWord3("");
		setMax(20);
		setGraphData([]);
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

	const handleModelChange = (e: any) => {
		setModelIndex(models.findIndex(m => m.short_name === e));
	};

	return (
		<Container>
			<div style={{ display: "flex", width: "100%", alignItems: "center" }}>
				<Select
					defaultValue={models[modelIndex].short_name}
					style={{ width: 220 }}
					optionLabelProp="label"
					onChange={handleModelChange}>
					{models.map(m => {
						return (
							<Option disabled={m.disable} value={m.short_name} label={m.name}>
								{m.name}
								{m.short_name === "wiki_ger" && (
									<Tag style={{ marginLeft: "8px" }} color="geekblue">
										new
									</Tag>
								)}
							</Option>
						);
					})}
				</Select>
				{loading && <Spin style={{ marginLeft: "8px" }}></Spin>}
			</div>

			<ModelInfo
				loading={loading}
				model={models[modelIndex]}
				wordVectors={wordVectors}></ModelInfo>

			<WordEmbeddings
				word={word}
				setWord={setWord}
				secondWord={secondWord}
				setSecondWord={setSecondWord}
				max={max}
				setMax={setMax}
				similarWords={similarWords}
				setSimilarWords={setSimilarWords}
				graphData={graphData}
				setGraphData={setGraphData}
				loading={loading}
				wordVectors={wordVectors}></WordEmbeddings>

			<WordAlgebra
				loading={loading}
				similarWords2={similarWords2}
				mathWord1={mathWord1}
				mathWord2={mathWord2}
				mathWord3={mathWord3}
				calculate={calculate}
				onWord1Change={e => setMathWord1(e)}
				onWord2Change={e => setMathWord2(e)}
				onWord3Change={e => setMathWord3(e)}></WordAlgebra>
		</Container>
	);
};

export default Word2VecEditor;
