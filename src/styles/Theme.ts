// my-theme.ts
import { DefaultTheme } from "styled-components";

const myTheme: DefaultTheme = {
  primaryColor: "#1890ff",
  lighgray: "#D9D9D9",
  screenSmallPortrait: "768px",
  screenMediumPortrait: "1024px",
  screenLargePortrait: "1824px",
};

const maxWidth = {
  SMALL: (props: { theme: DefaultTheme }) => props.theme.screenSmallPortrait,
  MEDIUM: (props: { theme: DefaultTheme }) => props.theme.screenMediumPortrait,
  LARGE: (props: { theme: DefaultTheme }) => props.theme.screenLargePortrait,
};

export { myTheme, maxWidth };
