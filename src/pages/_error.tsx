import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import PersonReading from "../styles/icons/PersonReading";
import { maxWidth } from "../styles/Theme";
import Link from "next/link";
import { A } from "../styles";

const ErrorPage = styled.div`
  height: 100%;
  flex-grow: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  svg {
    margin: 16px;
  }
  p {
    text-align: center;
    font-weight: bold;
    font-size: 40px;
    @media (max-width: ${maxWidth.SMALL}) {
      font-size: 30px;
      margin: 16px;
    }
  }
`;

const BackgroundText = styled.div`
  position: absolute;
  display: flex;
  font-weight: bold;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  color: #f3f2f2;
  transform: rotate(2deg);
  z-index: -1;
  font-size: 30px;
  text-transform: uppercase;
  font-size: 60vw;
  overflow: hidden;
  @media (max-width: ${maxWidth.SMALL}) {
    font-size: 80vw;
  }
`;

const Error = ({ statusCode }: any) => {
  return (
    <ErrorPage>
      <BackgroundText>{statusCode ? statusCode : "404"}</BackgroundText>
      <PersonReading height="50%"></PersonReading>
      <p>Ooops, that did not work.</p>
      <Link href="/">
        <A>
          <Button type="primary" size="large">
            Let's go home!
          </Button>
        </A>
      </Link>
    </ErrorPage>
  );
};

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
