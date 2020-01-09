import "antd/dist/antd.css";
import React from "react";
import Navbar from "../components/Navbar";
import "./Page.css";

const Page = (props: any) => {
	return (
		<div style={{ height: "100%", display: "flex", flexFlow: "column" }}>
			<Navbar></Navbar>
			{props.children}
		</div>
	);
};

export default Page;
