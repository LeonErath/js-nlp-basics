import { Button, message, Select, Spin, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import word2vec from './Word2Vec';
import { SimilarWord } from '../../interfaces';
import ModelInfo from './ModelInfo';
import WordAlgebra from './WordAlgebra';
import WordEmbeddings from './WordEmbeddings';
import { DataPoint } from '../../interfaces';
import { CenterContainer } from '../../styles/CenterContainer';
import { UploadDialog } from './UploadDialog';

const { Option } = Select;

const Container = styled.div`
	margin-top: 16px;
`;

const wordVectors = word2vec();

const Word2VecEditor = () => {
	const [word, setWord] = useState('');
	const [secondWord, setSecondWord] = useState<string[]>([]);
	const [similarWords, setSimilarWords] = useState<SimilarWord[]>([]);
	const [max, setMax] = useState(20);
	const [graphData, setGraphData] = useState<DataPoint[]>([]);

	const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

	const [mathWord1, setMathWord1] = useState('');
	const [mathWord2, setMathWord2] = useState('');
	const [mathWord3, setMathWord3] = useState('');
	const [models, setModels] = useState([]);
	const [loadingModels, setLoadingModels] = useState(true);

	const [modelIndex, setModelIndex] = useState(0);
	const [loading, setLoading] = useState(false);

	const [similarWords2, setSimilarWords2] = useState<SimilarWord[]>([]);

	useEffect(() => {
		setLoadingModels(true);

		fetch('/api/get-models')
			.then((data) => data.json())
			.then((data) => {
				setModels(data);
			})
			.finally(() => {
				setLoadingModels(false);
			});
	}, [isUploadDialogOpen]);

	useEffect(() => {
		if (models.length !== 0) {
			setLoading(true);

			fetch(models[modelIndex].url)
				.then((data) => data.json())
				.then((model) => {
					return wordVectors.dispose().loadModel(model);
				})
				.then(() => {
					reset();
				})
				.catch((e) => {
					message.error('An error occurred.');
					console.log(e);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [modelIndex, models]);

	const reset = () => {
		setWord('');
		setMathWord1('');
		setMathWord2('');
		setMathWord3('');
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
			setMathWord1('germany');
			setMathWord2('paris');
			setMathWord3('france');

			try {
				const subResult = await wordVectors.subtract([
					'paris',
					'france',
				]);
				const result = await wordVectors.add([
					subResult[0].word,
					'germany',
				]);
				setSimilarWords2(result);
			} catch (e) {
				console.log(e);

				message.info('No results were found.');
			}
		} else {
			try {
				const subResult = await wordVectors.subtract([
					mathWord2,
					mathWord3,
				]);
				if (subResult) {
					const result = await wordVectors.add([
						subResult[0].word,
						mathWord1,
					]);
					setSimilarWords2(result);
				}
			} catch (e) {
				console.log(e);

				message.info('No results were found.');
			}
		}
	};

	const handleModelChange = (e: any) => {
		setModelIndex(models.findIndex((m) => m.name === e));
	};

	if (loadingModels) {
		// TODO: Add Animation
		return (
			<CenterContainer>
				<Spin style={{ marginLeft: '8px' }}></Spin>
			</CenterContainer>
		);
	}

	return (
		<Container>
			<div
				style={{
					display: 'flex',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Select
					loading={loading}
					defaultValue={models[modelIndex]?.name}
					style={{ width: 220 }}
					optionLabelProp="label"
					onChange={handleModelChange}
				>
					{models.map((m) => {
						return (
							<Option
								disabled={m.disable}
								value={m.name}
								label={m.name}
							>
								{m.name}
								{m.name === 'harry-potter' && (
									<Tag
										style={{ marginLeft: '8px' }}
										color="geekblue"
									>
										new
									</Tag>
								)}
							</Option>
						);
					})}
				</Select>

				<Button
					onClick={() => setUploadDialogOpen(true)}
					icon={<UploadOutlined />}
					type="primary"
				>
					Upload own modal
				</Button>
			</div>

			<ModelInfo
				loading={loading}
				model={models[modelIndex]}
				wordVectors={wordVectors}
			></ModelInfo>

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
				wordVectors={wordVectors}
			></WordEmbeddings>

			<WordAlgebra
				loading={loading}
				similarWords2={similarWords2}
				mathWord1={mathWord1}
				mathWord2={mathWord2}
				mathWord3={mathWord3}
				calculate={calculate}
				onWord1Change={(e) => setMathWord1(e)}
				onWord2Change={(e) => setMathWord2(e)}
				onWord3Change={(e) => setMathWord3(e)}
			></WordAlgebra>
			<UploadDialog
				isOpen={isUploadDialogOpen}
				onOk={() => setUploadDialogOpen(false)}
				onCancel={() => setUploadDialogOpen(false)}
			/>
		</Container>
	);
};

export default Word2VecEditor;
