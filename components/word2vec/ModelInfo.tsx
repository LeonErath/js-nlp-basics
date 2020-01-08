import React from "react";
import { Row, Col, Statistic, Spin, Button } from "antd";
import { Model } from "./models";
import styled from "styled-components";

interface Props {
	loading: boolean;
	model: Model;
	wordVectors: any;
}

const StyledRow = styled.div`
	.ant-row {
		display: flex;
		width: 100%;
		align-items: center;
		margin-bottom: 64px;

		@media (max-width: 1050px) {
			::before {
				content: none;
			}
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			grid-template-rows: 1fr 1fr;
		}

		@media (max-width: 768px) {
			::before {
				content: none;
			}
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr 1fr 1fr;
		}
	}
`;

const ModelInfo = ({ model, loading, wordVectors }: Props) => {
	return (
		<StyledRow style={{ marginTop: "16px", marginBottom: "32px" }}>
			<Row gutter={16}>
				<Col span={7} style={{ minWidth: "200px", marginTop: "16px" }}>
					<Statistic title="Model" value={model.name} />
				</Col>
				<Col
					span={3}
					style={{ marginRight: "32px", marginTop: "16px", minWidth: "100px" }}>
					{loading && (
						<Spin>
							<Statistic title="Words/Vectors" value={wordVectors.modelSize} />
						</Spin>
					)}
					{!loading && (
						<Statistic title="Words/Vectors" value={wordVectors.modelSize} />
					)}
				</Col>
				<Col
					span={3}
					style={{ marginRight: "32px", marginTop: "16px", minWidth: "100px" }}>
					{loading && (
						<Spin>
							<Statistic
								title="Dimensions"
								value={wordVectors.vectorDimensions}
							/>
						</Spin>
					)}
					{!loading && (
						<Statistic
							title="Dimensions"
							value={wordVectors.vectorDimensions}
						/>
					)}
				</Col>
				<Col
					span={3}
					style={{ marginRight: "32px", marginTop: "16px", minWidth: "140px" }}>
					<Statistic title="Size" value={model.fileSize} />
				</Col>
				<Col span={4} style={{ marginTop: "16px", minWidth: "140px" }}>
					<Statistic title="Language" value={model.language} />
				</Col>
				<Button
					style={{ marginTop: "16px", marginLeft: "8px" }}
					icon="download"
					href={model.url}
					download={model.short_name + ".json"}
					target={"blank"}></Button>
			</Row>
		</StyledRow>
	);
};

export default ModelInfo;
