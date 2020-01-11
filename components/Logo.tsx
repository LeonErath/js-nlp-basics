import React, { useState } from "react";
import Lottie from "react-lottie";
import logo1 from "../public/logo/logo1.json";
import logo2 from "../public/logo/logo2.json";
import logo3 from "../public/logo/logo3.json";
import logo4 from "../public/logo/logo4.json";
import styled from "styled-components";

const Container = styled.div`
	display: flex;
	:hover {
		transform: scale(1.1) skew(-0.06turn, 2deg);
	}
	g > * {
		stroke-width: 9;
	}

	transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
`;

const Logo = () => {
	const defaultOptions = {
		loop: false,
		autoplay: true,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice"
		}
	};
	return (
		<Container>
			<Lottie
				options={{ ...defaultOptions, animationData: logo1 }}
				height={70}
				width={30}
			/>
			<Lottie
				options={{ ...defaultOptions, animationData: logo2 }}
				height={70}
				width={30}
			/>
			<Lottie
				options={{ ...defaultOptions, animationData: logo3 }}
				height={70}
				width={30}
			/>
			<Lottie
				options={{ ...defaultOptions, animationData: logo4 }}
				height={70}
				width={30}
			/>
		</Container>
	);
};

export default Logo;
