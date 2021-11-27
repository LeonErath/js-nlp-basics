import { Button, Input } from "antd";
import React, { useState } from "react";
import nlp from "compromise";
import styled from "styled-components";
import { SyncOutlined } from "@ant-design/icons";
import { TokenizeExamples } from "../../data/tokenize-examples";
import { getRandomInt } from "../../util/random.util";
import Title from "antd/lib/typography/Title";

const Token = styled.span`
  padding: 2px 4px;
  border-radius: 4px;
  background: #dfebfc;
`;

const TokenContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const randomSentence = () =>
  TokenizeExamples[getRandomInt(0, TokenizeExamples.length - 1)];

export const TokenizeEditor = () => {
  const [value, setValue] = useState(randomSentence());

  const tokens = nlp(value).terms().out("array");

  const randomize = () => setValue(randomSentence());

  return (
    <div>
      <Title level={2}>Tokenization</Title>
      <label>input:</label>
      <Input.Group compact>
        <Input
          style={{ width: "calc(100% - 32px)" }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={randomize} icon={<SyncOutlined />} />
      </Input.Group>
      <label>output:</label>
      <TokenContainer>
        {tokens.map((t) => (
          <Token>{t}</Token>
        ))}
      </TokenContainer>
    </div>
  );
};
