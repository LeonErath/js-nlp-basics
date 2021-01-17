import {
	CheckCircleTwoTone,
	CopyOutlined,
	LogoutOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import { Input, Form, Typography, Avatar, Button, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Link from 'next/link';
import React, { useState } from 'react';
import styled from 'styled-components';
import { updateUserInfo, UserInfo } from '../lib/api';
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
	const [form] = useForm();
	const [hasChanged, setChanged] = useState(false);

	const { user } = useUser();

	const updateProfile = async () => {
		try {
			const data = await form.validateFields();
			const updates: UserInfo = {};
			if (data.email && data.email !== user.email) {
				updates['email'] = data.email;
			}
			if (data.name && data.name !== user.name) {
				updates['name'] = data.name;
			}

			await updateUserInfo(user.sub, updates);
			message.success('Your profile has been updated.');
		} catch (err) {
			message.error('Sadly we could not update your profile.');
			form.setFieldsValue({ name: user.name });
			form.setFieldsValue({ email: user.email });
		}

		setChanged(false);
	};

	return (
		<Base>
			<Container>
				<Header>
					<Avatar size={128} src={user?.picture} />

					<Title level={2} className="title">
						Welcome {user.nickname}
						👋🏻
					</Title>
				</Header>

				<Form
					onFinish={updateProfile}
					form={form}
					layout="vertical"
					name="profile"
					onChange={() => setChanged(true)}
				>
					<Form.Item name="id" label="ID" initialValue={user.sub}>
						<Input
							readOnly
							placeholder="Your user id"
							addonAfter={<CopyOutlined onClick={() => {}} />}
						/>
					</Form.Item>
					<Form.Item
						name="name"
						label="Name"
						initialValue={user.name}
					>
						<Input placeholder="Here your name.." />
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
					>
						<Input
							placeholder="Here your email.."
							addonAfter={
								user.email_verified ? (
									<CheckCircleTwoTone twoToneColor="#52c41a" />
								) : null
							}
						/>
					</Form.Item>
					<ButtonContainer>
						<Form.Item>
							<Button disabled={!hasChanged} htmlType="submit">
								<SaveOutlined /> Save
							</Button>
						</Form.Item>
						<Form.Item>
							<Button danger>
								<Link href="/api/logout">
									<a>
										<LogoutOutlined /> Logout
									</a>
								</Link>
							</Button>
						</Form.Item>
					</ButtonContainer>
				</Form>
			</Container>
		</Base>
	);
};

export default Profile;
