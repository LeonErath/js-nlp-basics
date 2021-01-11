import { LoginOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	margin: 64px;
	max-width: 1000px;
	@media (max-width: 768px) {
		margin: 32px;
	}
`;

const Logout = () => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				alignItems: 'center',
			}}
		>
			<Container>
				<Result
					status="success"
					title="You successfully logged out."
					subTitle="we are happy when you are happy"
					extra={[
						<Button type="primary" key="home">
							<Link href="/">
								<a>Home</a>
							</Link>
						</Button>,
						<Button key="login">
							<Link href="/api/login">
								<a>
									<LoginOutlined /> Login again
								</a>
							</Link>
						</Button>,
					]}
				/>
			</Container>
		</div>
	);
};

export default Logout;
