import { Empty } from "antd";
import React from "react";
import {
	CartesianGrid,
	Legend,
	Scatter,
	ScatterChart,
	Tooltip,
	XAxis,
	YAxis,
	ResponsiveContainer
} from "recharts";
import { DataPoint } from "./models";

interface Props {
	loading: boolean;
	data: DataPoint[];
}

const Graph = React.memo(({ loading, data }: Props) => {
	const renderTooltip = (props: any) => {
		if (props.payload.length === 0) {
			return <div>hello</div>;
		}

		return (
			<div>
				{props.payload[0].payload.name} {Math.ceil(props.payload[0].payload.x)}{" "}
				{Math.ceil(props.payload[0].payload.y)}
			</div>
		);
	};

	const uniqueInputs = [...new Set(data.map(item => item.input))];

	return (
		<div>
			{data.length !== 0 && (
				<ResponsiveContainer height={360} width={"100%"}>
					<ScatterChart margin={{ top: 36, right: 20, bottom: 10, left: 10 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<YAxis
							dataKey="y"
							name="y"
							type="number"
							tickFormatter={tick => Math.ceil(tick)}
						/>
						<XAxis
							dataKey="x"
							name="x"
							type="number"
							tickFormatter={tick => Math.ceil(tick)}
						/>

						<Tooltip content={(props: any) => renderTooltip(props)} />
						<Legend />
						{uniqueInputs.map(input => {
							return (
								<Scatter
									name={input}
									data={data.filter(d => d.input === input)}
									fill={
										"#" +
										Math.random()
											.toString(16)
											.slice(2, 8)
									}
								/>
							);
						})}
					</ScatterChart>
				</ResponsiveContainer>
			)}
			{data.length === 0 && <Empty style={{ marginTop: "64px" }}></Empty>}
		</div>
	);
});

export default Graph;
