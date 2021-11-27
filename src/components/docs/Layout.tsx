import styled from "styled-components";
import { maxWidth } from "../../styles/Theme";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 90%;
`;

const ArticleContainer = styled.div`
  width: 100%;
  min-height: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 1000px;
  padding: 32px 64px;
  border-right: 1px solid #f0f1f2;
  border-left: 1px solid #f0f1f2;

  @media (max-width: ${maxWidth.SMALL}) {
    padding: 8px 16px;
  }
`;

export const Layout = (props: { children: React.ReactNode }) => {
  return (
    <Container>
      <ArticleContainer>{props.children}</ArticleContainer>
    </Container>
  );
};
