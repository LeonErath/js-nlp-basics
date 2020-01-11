import "antd/dist/antd.css";
import React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import Navbar from "../components/Navbar";
import { myTheme } from "../styles/Theme";

const GlobalStyle = createGlobalStyle`
	html,body {
		box-sizing: border-box;
		height: 100%;
	}

	#__next {
		height: 100%;
	}
`;

const Page = (props: any) => {
	return (
		<ThemeProvider theme={myTheme}>
			<GlobalStyle />
			<div style={{ height: "100%", display: "flex", flexFlow: "column" }}>
				<Navbar></Navbar>
				{props.children}
			</div>
		</ThemeProvider>
	);
};

export default Page;
