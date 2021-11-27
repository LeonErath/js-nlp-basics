import { Button, Divider, Input, Select } from "antd";
import React, { useState } from "react";
import nlp from "compromise";
import styled from "styled-components";
import { DownloadOutlined, SyncOutlined } from "@ant-design/icons";

import { getRandomInt } from "../../util/random.util";
import nlpSentences from "compromise-sentences";
import { SentenceExamples } from "../../data/sentence-examples";
import Title from "antd/lib/typography/Title";
import { CodeBlock } from "../code/CodeBlock";
import { elipsis } from "../../util/test.util";

const snlp = nlp.extend(nlpSentences);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Sentence = styled.span`
  padding: 2px 4px;
  border-radius: 4px;
  background: #feedff;
`;

const SentenceContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
`;

const transformCode = (value: string, transform: string) => {
  if (transform === "past") {
    return `
import nlp from "compromise";
import nlpSentences from "compromise-sentences";

nlp.extend(nlpSentences);

nlp("${value}").sentences().toPastTense().text();
    `;
  }
  if (transform === "future") {
    return `
import nlp from "compromise";
import nlpSentences from "compromise-sentences";

nlp.extend(nlpSentences);
    
nlp("${value}").sentences().toFutureTense().text()`;
  }
  if (transform === "negative") {
    return `
import nlp from "compromise";
import nlpSentences from "compromise-sentences";
    
nlp.extend(nlpSentences);
        
nlp("${value}").sentences().toNegative().text()`;
  }
  if (transform === "positive") {
    return `
import nlp from "compromise";
import nlpSentences from "compromise-sentences";
    
nlp.extend(nlpSentences);
nlp("${value}").sentences().toPositive().text()`;
  }

  return `return "${value}"`;
};

const randomSentence = () =>
  SentenceExamples[getRandomInt(0, SentenceExamples.length - 1)].replaceAll(
    "\n",
    ""
  );

export const SentenceEditor = () => {
  const [transform, setTransform] = useState("");
  const [value, setValue] = useState(randomSentence());

  const normalizedValue = value.replaceAll("\n", " ");

  const sentences = snlp(normalizedValue).sentences().out("array");

  const getTransformedText = () => {
    if (transform === "past") {
      return (snlp(normalizedValue).sentences() as any).toPastTense().text();
    }
    if (transform === "future") {
      return (snlp(normalizedValue).sentences() as any).toFutureTense().text();
    }
    if (transform === "negative") {
      return (snlp(normalizedValue).sentences() as any).toNegative().text();
    }
    if (transform === "positive") {
      return (snlp(normalizedValue).sentences() as any).toPositive().text();
    }

    return normalizedValue;
  };

  const randomize = () => setValue(randomSentence());

  const getDownloadLink = () =>
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(sentences));

  return (
    <Container>
      <Title level={2}>Sentence Splitting</Title>
      <label>input:</label>
      <Input.TextArea
        value={value}
        autoSize={{ minRows: 2, maxRows: 10 }}
        onChange={(e) => setValue(e.target.value)}
      />
      <div style={{ display: "flex", gap: "4px" }}>
        <Button
          onClick={randomize}
          style={{ width: "200px" }}
          icon={<SyncOutlined />}
        >
          Generate
        </Button>
        <Button
          href={getDownloadLink()}
          download="sentences.json"
          icon={<DownloadOutlined />}
        />
      </div>
      <label>output:</label>
      <SentenceContainer>
        {sentences.map((t) => (
          <Sentence>{t}</Sentence>
        ))}
      </SentenceContainer>
      <Divider />
      <Title level={4}>Transforms</Title>
      <Select
        style={{ width: 200 }}
        placeholder="Select a Transformation"
        onChange={(v) => setTransform(v as any)}
      >
        <Select.Option value="">no transformation</Select.Option>
        <Select.Option value="past">to past tense</Select.Option>
        <Select.Option value="future">to future tense</Select.Option>
        <Select.Option value="negative">to negative</Select.Option>
        <Select.Option value="positive">to positive</Select.Option>
      </Select>

      <CodeBlock
        code={transformCode(elipsis(normalizedValue), transform)}
        language="javascript"
      />
      <SentenceContainer>{getTransformedText()}</SentenceContainer>
    </Container>
  );
};
