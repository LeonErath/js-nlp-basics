import React from "react";
import Visualizer from "../components/Visualizer";
import Navbar from "../components/Navbar";
import "./index.css";
import "antd/dist/antd.css";

const Home = () => {
	return (
		<div>
			<Navbar></Navbar>
			<Visualizer></Visualizer>
		</div>
	);
};

export default Home;
