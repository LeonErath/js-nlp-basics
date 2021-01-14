import 'antd/dist/antd.css';
import React from 'react';
import Page from '../components/Page';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Router } from 'next/router';
import '../styles/index.css';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({ Component, pageProps }) => {
	return (
		<Page>
			<Component {...pageProps} />
		</Page>
	);
};

export default MyApp;
