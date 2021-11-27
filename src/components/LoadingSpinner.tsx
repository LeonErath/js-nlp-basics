import { Button, Spin } from 'antd';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useRouter } from 'next/router';

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

interface Props {
	text: string;
}

export const LoadingSpinner = (props: Props) => {
	const router = useRouter();

	return (
		<Base>
			<Container>
				<Spin
					indicator={
						<LoadingOutlined style={{ fontSize: 48 }} spin />
					}
				></Spin>
				<div className="text">
					<p>{props.text}</p>
				</div>
				<div className="buttonContainer">
					<Button href={router ? router.pathname : '/'}>
						<ReloadOutlined /> reload
					</Button>
				</div>
			</Container>
		</Base>
	);
};
