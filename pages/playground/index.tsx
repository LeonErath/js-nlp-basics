import React from "react";
import { Card } from "antd";
import styled from "styled-components";
import Link from "next/link";

const Container = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 100%;
	margin: 64px;
	max-width: 1000px;
	@media (max-width: 768px) {
		margin: 32px;
	}
`;

const Playground = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				alignItems: "center",
			}}>
			<Container>
				<Card
					title="Word2Vec"
					hoverable
					extra={
						<Link href="/playground/word2vec">
							<a>more...</a>
						</Link>
					}
					style={{ width: 300, margin: "16px", height: 300 }}>
					<p>Card content</p>
					<p>Card content</p>
					<p>Card content</p>
				</Card>
				<Card
					title="POS-Tagging"
					hoverable
					extra={
						<Link href="/playground/postagging">
							<a>more...</a>
						</Link>
					}
					style={{ width: 300, margin: "16px", height: 300 }}>
					<p>Card content</p>
					<p>Card content</p>
					<p>Card content</p>
				</Card>
			</Container>
		</div>
	);
};

export default Playground;
