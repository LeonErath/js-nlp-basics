import { Auth0Provider } from '@auth0/auth0-react';
import 'antd/dist/antd.css';
import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbar';
import { myTheme } from '../styles/Theme';

const GlobalStyle = createGlobalStyle`
	html,body {
		box-sizing: border-box;
		height: 100%;
	}

	#__next {
		height: 100%;
	}
`;

const Page = (props) => {
	console.log(process.env);

	return (
		<Auth0Provider
			domain="dev-5809a71r.eu.auth0.com"
			clientId="Xa15g6lYIkg5lp5R8fF4Z0n4rmYRf1xA"
			redirectUri={
				process.env.VERCEL_URL
					? process.env.VERCEL_URL
					: 'http://localhost:3000'
			}
		>
			<ThemeProvider theme={myTheme}>
				<GlobalStyle />
				<div
					style={{
						height: '100%',
						display: 'flex',
						flexFlow: 'column',
					}}
				>
					<Navbar></Navbar>
					{props.children}
				</div>
			</ThemeProvider>
		</Auth0Provider>
	);
};

export default Page;
