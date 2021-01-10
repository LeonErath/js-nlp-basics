import 'antd/dist/antd.css';
import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbar';
import { useFetchUser, UserProvider } from '../lib/user';
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
	console.log(process.env.NEXT_PUBLIC_VERCEL_URL);
	const { user, loading } = useFetchUser();

	return (
		<UserProvider value={{ user, loading }}>
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
		</UserProvider>
	);
};

export default Page;
