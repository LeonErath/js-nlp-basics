import React from 'react';
import styled from 'styled-components';
import withAuth from '../components/with-auth';
import { useUser } from '../lib/user';

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

const Profile = () => {
	const { user, loading } = useUser();

	if (loading) {
		return <div>Loading...</div>;
	}

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
				<div>
					<div>name: {user.name}</div>
					<div>email: {user.email}</div>
					<div>nickname: {user.nickname}</div>
					<div>
						pic: <img src={user.picture} />
					</div>
				</div>
			</Container>
		</div>
	);
};

export default withAuth(Profile);
