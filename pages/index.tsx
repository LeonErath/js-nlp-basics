import "antd/dist/antd.css";
import Lottie from "react-lottie";
import teaching from "../public/illustrations/teaching.json";
import React, { useEffect } from "react";
import styled from "styled-components";
import { Button } from "antd";
import Link from "next/link";
import { A } from "../styles";

const Container = styled.div`
	width: 100%;
	flex-grow: 1;
	display: flex;
	align-items: center;
	flex-direction: column;
	background-image: url("/backgrounds/9.svg");
	background-repeat: no-repeat;
	background-attachment: fixed;
	background-position: center;
`;

const Headline1 = styled.h1`
	margin-top: 100px;
	color: #232529;
	font-size: 4.5rem;
	font-weight: bold;
	line-height: 0.75;
`;

const Headline2 = styled.h2`
	max-width: 500px;
	color: #6d7380;
	font-size: 1.1rem;
	line-height: 2;
	text-align: center;
	font-weight: 300;
	margin-bottom: 16px;
`;

const Home = () => {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice"
		}
	};

	useEffect(() => {
		const getData = async () => {
			fetch("/api/comments")
				.then(data => data.json())
				.then(data => {
					console.log(data);
				})
				.catch(e => {
					console.log(e);
				});
		};
		getData();
	}, []);
	return (
		<Container>
			<Headline1>Hello World</Headline1>
			<Headline2>
				Explore, Learn, Discover natural language processing. Dive into the deep
				world of artificial intelligence and linguistics.
			</Headline2>
			<Link href="/playground">
				<A>
					<Button type="primary" size="large" shape="round">
						Let's Go
					</Button>
				</A>
			</Link>

			<Lottie
				options={{ ...defaultOptions, animationData: teaching }}
				height={1080 / 2.4}
				width={"100%"}
			/>
		</Container>
	);
};

export default Home;
