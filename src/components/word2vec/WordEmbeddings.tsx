import {
  Button,
  Empty,
  Input,
  InputNumber,
  message,
  Table,
  Radio,
  Select,
} from "antd";
import React, { useState } from "react";
import { SimilarWord } from "../../interfaces";
import Graph from "./Graph";

import styled from "styled-components";
import { DataPoint } from "../../interfaces";
import { CodeBlock } from "../code/CodeBlock";
import { Word2Vec } from "../../lib/word2vec/Word2Vec";
import { SyncOutlined } from "@ant-design/icons";

interface Props {
  url: string;
  loading: boolean;
  wordVectors: Word2Vec;
  word: string;
  setWord: (v: string) => void;
  secondWord: string[];
  setSecondWord: (v: string[]) => void;
  max: number;
  setMax: (v: number) => void;
  similarWords: SimilarWord[];
  setSimilarWords: (words: SimilarWord[]) => void;
  graphData: DataPoint[];
  setGraphData: (data: DataPoint[]) => void;
}

const columns = [
  {
    title: "Word",
    dataIndex: "word",
  },
  {
    title: "Distance",
    dataIndex: "distance",
  },
];

const Text = styled.div`
  display: flex;
  width: 80%;
  font-size: "16px";
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const generateCode = (
  url: string,
  word: string,
  max: number,
  epislon: number,
  perplexity: number
) => `
const name = "${word}";

const max = ${max};
const epislon = ${epislon};
const perplexity= ${perplexity};

// https://github.com/ml5js/ml5-library/blob/4e002da3f17800cd9fc3aca99a9b9b0e6f6c02f2/src/Word2vec/index.js
const wordVectors = new Word2Vec();

const rawData = await fetch("${url}");
const data = await rawData.json()
  
await wordVectors.loadModel(model);
  
const similarities = await wordVectors.nearest(name, max);
const coordinates = await wordVectors.getCoordinates([name], epislon, perplexity, max);
`;

const WordEmbeddings = ({
  loading,
  wordVectors,
  word,
  setWord,
  secondWord,
  setSecondWord,
  url,
  max,
  setMax,
  similarWords,
  setSimilarWords,
  graphData,
  setGraphData,
}: Props) => {
  const [epislon, setEpsilon] = useState(10);
  const [perplexity, setPerplexity] = useState(10);
  const [showGraph, setShowGraph] = useState(true);

  const handleEmbeddings = async () => {
    if (word.length === 0) {
      const randomWord = await wordVectors.getRandomWord();

      setWord(randomWord);

      getNearestVectors(randomWord);
      makeGraph(randomWord);
    } else {
      getNearestVectors(word);
      makeGraph(word);
    }
  };

  const randomize = async () => {
    const randomWord = await wordVectors.getRandomWord();
    setWord(randomWord);

    getNearestVectors(randomWord);
    makeGraph(randomWord);
  };

  const addWord = () => {
    if (secondWord.length !== 0) {
      wordVectors
        .getCoordinates([word, ...secondWord], epislon, perplexity, max)
        .then((solution: DataPoint[]) => {
          setGraphData(solution);
        })
        .catch((e: any) => {
          console.log(e);
          message.error("An error occurred.");
        });
    }
  };

  const getNearestVectors = async (word: string) => {
    if (word.length !== 0) {
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

  const makeGraph = (word: string) => {
    if (word.length === 0) {
      return;
    }
    wordVectors
      .getCoordinates([word], epislon, perplexity, max)
      .then((solution: DataPoint[]) => {
        setGraphData(solution);
      })
      .catch((e: any) => {
        console.log(e);
        message.error("An error occurred.");
      });
  };

  return (
    <div>
      <div style={{ marginTop: "32px", marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            width: "80%",
            fontSize: "22px",
            marginBottom: "16px",
          }}
        >
          Word Embeddings
        </div>
        <Text>
          The embeddings you have trained will now be displayed. You can search
          for words to find their closest neighbors. For example, try searching
          for "beautiful". You may see neighbors like "wonderful".
        </Text>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Input.Group compact style={{ width: "300px" }}>
          <Input
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEmbeddings();
              }
            }}
            value={word}
            style={{ width: "calc(300px - 32px)" }}
            placeholder="Type a word..."
            onChange={(e) => setWord(e.target.value)}
          />
          <Button onClick={randomize} icon={<SyncOutlined />} />
        </Input.Group>
        <InputNumber
          disabled={loading}
          min={1}
          max={50}
          defaultValue={max}
          onChange={(e) => {
            if (e) {
              setMax(Number(e.toString()));
            }
          }}
        />
        <Button onClick={handleEmbeddings} disabled={loading}>
          Calculate
        </Button>
        <Radio.Group
          onChange={() => {
            setShowGraph(!showGraph);
          }}
          defaultValue="a"
        >
          <Radio.Button value="a">Graph</Radio.Button>
          <Radio.Button value="b">Table</Radio.Button>
        </Radio.Group>
      </div>
      {showGraph && word.length !== 0 && graphData.length !== 0 && (
        <div style={{ marginTop: "16px" }}>
          <Select
            defaultValue={secondWord}
            mode="tags"
            notFoundContent={null}
            style={{
              maxWidth: "400px",
              marginTop: "16px",
              width: "100%",
              marginRight: "8px",
            }}
            placeholder="Add more words.."
            onChange={(v: string[]) => setSecondWord(v)}
          ></Select>

          <Button
            onClick={addWord}
            disabled={loading}
            style={{ marginTop: "16px" }}
          >
            Apply
          </Button>
        </div>
      )}
      {showGraph && (
        <div style={{ marginTop: "16px" }}>
          <span style={{ marginRight: "8px" }}>Epsilon:</span>
          <InputNumber
            disabled={loading}
            min={1}
            max={500}
            defaultValue={epislon}
            onChange={(e: number | undefined) => {
              if (e) setEpsilon(e);
            }}
            style={{ marginRight: "8px", marginTop: "16px" }}
          />
          <span style={{ marginRight: "8px" }}>Vebosity:</span>
          <InputNumber
            disabled={loading}
            min={1}
            max={500}
            defaultValue={perplexity}
            onChange={(e: number | undefined) => {
              if (e) setPerplexity(e);
            }}
            style={{ marginRight: "8px", marginTop: "16px" }}
          />
        </div>
      )}

      <CodeBlock
        code={generateCode(url, word, max, epislon, perplexity)}
        language="javascript"
      />

      {similarWords.length === 0 && (
        <Empty style={{ marginTop: "64px" }}></Empty>
      )}

      {similarWords.length !== 0 && !showGraph && (
        <Table
          dataSource={similarWords}
          columns={columns}
          bordered
          size="middle"
          style={{ marginTop: "16px" }}
        ></Table>
      )}
      {graphData.length !== 0 && showGraph && (
        <Graph data={graphData} loading={loading}></Graph>
      )}
    </div>
  );
};

export default WordEmbeddings;
