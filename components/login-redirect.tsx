import Router from 'next/router';
import React, { Component } from 'react';

import createLoginUrl from '../lib/url-helper';
import styled from 'styled-components';
import { Button, Spin } from 'antd';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';

const Base = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	align-items: center;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
	height: 100%;
	margin: 64px;
	max-width: 500px;
	@media (max-width: 768px) {
		margin: 32px;
	}
	.text {
		margin-top: 16px;
		text-align: center;
	}
	.buttonContainer {
		display: flex;
		justify-content: center;
	}
`;

export default class RedirectToLogin extends Component {
	componentDidMount(): void {
		window.location.assign(createLoginUrl(Router.pathname));
	}

	render(): React.ReactElement {
		return (
			<Base>
				<Container>
					<Spin
						indicator={
							<LoadingOutlined style={{ fontSize: 48 }} spin />
						}
					></Spin>
					<div className="text">
						<p>Signing you in...</p>
					</div>
					<div className="buttonContainer">
						<Button href={Router.pathname}>
							<ReloadOutlined /> reload
						</Button>
					</div>
				</Container>
			</Base>
		);
	}
}
