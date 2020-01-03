import React from "react";
import { Row, Col, Statistic, Spin, Button } from "antd";
import { Model } from "./models";

interface Props {
	loading: boolean;
	model: Model;
	wordVectors: any;
}

const ModelInfo = ({ model, loading, wordVectors }: Props) => {
	return (
		<div style={{ marginTop: "32px", marginBottom: "32px" }}>
			<Row
				gutter={16}
				style={{
					display: "flex",
					width: "100%",
					alignItems: "center",
					marginBottom: "64px",
					flexWrap: "wrap"
				}}>
				<Col span={7} style={{ minWidth: "200px" }}>
					<Statistic title="Model" value={model.name} />
				</Col>
				<Col span={3} style={{ marginRight: "32px" }}>
					{loading && (
						<Spin>
							<Statistic title="Words/Vectors" value={wordVectors.modelSize} />
						</Spin>
					)}
					{!loading && (
						<Statistic title="Words/Vectors" value={wordVectors.modelSize} />
					)}
				</Col>
				<Col span={3} style={{ marginRight: "32px" }}>
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
				<Col span={3} style={{ marginRight: "32px" }}>
					<Statistic title="Size" value={model.fileSize} />
				</Col>
				<Col span={4}>
					<Statistic title="Language" value={model.language} />
				</Col>
				<Button
					icon="download"
					href={model.url}
					download={model.short_name + ".json"}
					target={"blank"}></Button>
			</Row>
		</div>
	);
};

export default ModelInfo;
