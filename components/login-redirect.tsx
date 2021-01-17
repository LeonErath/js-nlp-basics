import Router from 'next/router';
import React, { Component } from 'react';

import createLoginUrl from '../lib/url-helper';
import { LoadingSpinner } from './LoadingSpinner';

export default class RedirectToLogin extends Component {
	componentDidMount(): void {
		window.location.assign(createLoginUrl(Router ? Router.pathname : '/'));
	}

	render(): React.ReactElement {
		return <LoadingSpinner text="Signing you in..." />;
	}
}
