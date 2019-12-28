import React from "react";
import styled from "styled-components";
import { Button, Select } from "antd";
const { Option } = Select;

const Container = styled.div`
	display: flex;
	margin-bottom: 16px;
	margin-top: 16px;
	align-items: center;
`;

const Toolbar = () => {
	return (
		<Container>
			<Button style={{ marginRight: "8px" }}>Click me</Button>
			<Select
				mode="multiple"
				style={{ width: "100%", marginRight: "8px", maxWidth: "600px" }}
				placeholder="select one or more methods"
				defaultValue={["pos"]}
				optionLabelProp="label">
				<Option value="token" label="Token">
					Tokenization
				</Option>
				<Option value="lemma" label="Lemma">
					Lemmatization
				</Option>
				<Option value="pos" label="POS-Tagging">
					POS-Tagging
				</Option>
				<Option value="ner" label="NER-Tagging">
					NER-Tagging
				</Option>
			</Select>
			<Select defaultValue="compromise" style={{ width: 120 }}>
				<Option value="compromise">Compromise</Option>
				<Option value="google-nlp">Google NLP</Option>
				<Option value="spacy">SpaCy</Option>
				<Option value="corenlp">CoreNLP</Option>
			</Select>
		</Container>
	);
};

export default Toolbar;
