import {
	CheckCircleTwoTone,
	LogoutOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import { Input, Form, Typography, Avatar, Button, Skeleton } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';
import styled from 'styled-components';
import withAuth from '../components/with-auth';
import { useUser } from '../lib/user';

const { Title } = Typography;

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
	width: 100%;
	height: 100%;
	margin: 64px;
	max-width: 500px;
	@media (max-width: 768px) {
		margin: 32px;
	}
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	.title {
		margin-top: 8px;
		margin-bottom: 40px;
	}
`;

const ButtonContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	button {
		margin: 8px;
	}
`;

const Profile = () => {
	const [hasChanged, setChanged] = useState(false);
	const { user, loading } = useUser();

	return (
		<Base>
			<Container>
				<Header>
					{loading ? (
						<Skeleton.Avatar size={128} active />
					) : (
						<Avatar size={128} src={user?.picture} />
					)}

					<Title level={2} className="title">
						Welcome {user?.nickname}
						👋🏻
					</Title>
				</Header>
				{user && (
					<Form
						layout="vertical"
						name="profile"
						onChange={() => setChanged(true)}
					>
						<Form.Item
							name="name"
							label="Name"
							initialValue={user.name}
							rules={[
								{
									required: true,
									message:
										'Please select a custom model to upload.',
								},
							]}
						>
							<Input placeholder="Here your name.."></Input>
						</Form.Item>
						<Form.Item
							extra={
								user.email_verified
									? 'Your email has been verified.'
									: null
							}
							name="email"
							label="Email"
							initialValue={user.email}
							rules={[
								{
									required: true,
									message:
										'Please select a custom model to upload.',
								},
							]}
						>
							<Input
								placeholder="Here your email.."
								addonAfter={
									user.email_verified ? (
										<CheckCircleTwoTone twoToneColor="#52c41a" />
									) : null
								}
							></Input>
						</Form.Item>
					</Form>
				)}
				<ButtonContainer>
					<Button disabled={!hasChanged}>
						<SaveOutlined /> Save
					</Button>
					<Button danger>
						<Link href="/api/logout">
							<a>
								<LogoutOutlined /> Logout
							</a>
						</Link>
					</Button>
				</ButtonContainer>
			</Container>
		</Base>
	);
};

export default withAuth(Profile);
