import 'antd/dist/antd.css';
import React from 'react';
import Page from '../components/Page';

const MyApp = ({ Component, pageProps }) => {
	return (
		<Page>
			<Component {...pageProps} />
		</Page>
	);
};

export default MyApp;
