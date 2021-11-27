import { Button, Input } from "antd";
import React, { useState } from "react";
import nlp from "compromise";
import styled from "styled-components";
import { SyncOutlined } from "@ant-design/icons";
import { TokenizeExamples as POSExamples } from "../../data/tokenize-examples";
import { getRandomInt } from "../../util/random.util";
import Title from "antd/lib/typography/Title";
import { CodeBlock } from "../code/CodeBlock";
import { elipsis } from "../../util/test.util";

const TAG = styled.span`
  padding: 2px 4px;
  border-radius: 4px;
  background: #fce6df;
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-height: 400px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 8px;

    > div {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      > div {
        display: flex;
        flex-direction: row;
        gap: 4px;
      }
    }
  }
`;

type SentenceTags = {
  [key: string]: string[];
};

const exampleCode = (value: string) => `
import nlp from "compromise"

const input = "${value}"

nlp(input).out("tags") 
`;

const randomSentence = () =>
  POSExamples[getRandomInt(0, POSExamples.length - 1)];

export const POSEditor = () => {
  const [value, setValue] = useState(randomSentence());

  const tags = (nlp(value).out("tags") as unknown as SentenceTags[]) ?? [];

  console.log(tags);

  const randomize = () => setValue(randomSentence());

  return (
    <div>
      <Title level={2}>POS</Title>
      <label>input:</label>
      <Input.Group compact>
        <Input
          style={{ width: "calc(100% - 32px)" }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={randomize} icon={<SyncOutlined />} />
      </Input.Group>
      <CodeBlock code={exampleCode(elipsis(value, 60))} language="javascript" />
      <label>output:</label>
      <ResultContainer>
        {tags.map((sentence) => (
          <div>
            {Object.keys(sentence).map((word: string) => (
              <div>
                <div>
                  <span>{word}</span>
                </div>
                <div>
                  {sentence[word].map((tag) => (
                    <TAG>{tag}</TAG>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </ResultContainer>
    </div>
  );
};
