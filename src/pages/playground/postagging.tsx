import { Divider } from "antd";
import React from "react";
import styled from "styled-components";
import { POSEditor } from "../../components/tagging/POSEditor";
import { SentenceEditor } from "../../components/tagging/SentenceEditor";
import { TokenizeEditor } from "../../components/tagging/TokenizeEditor";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 64px;
  max-width: 1000px;
  gap: 32px;
  @media (max-width: 768px) {
    padding: 32px;
  }
`;

const posTagging = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Container>
        <TokenizeEditor />
        <Divider />
        <SentenceEditor />
        <Divider />
        <POSEditor />
        <Divider />
      </Container>
    </div>
  );
};

export default posTagging;
