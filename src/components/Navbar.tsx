import React from "react";
import styled from "styled-components";
import { Button, Menu, Icon } from "antd";
const { SubMenu } = Menu;

const MenuBar = styled.div`
	height: 64px;
	background: white;
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	align-items: center;
	justify-content: space-between;
	padding-right: 32px;
	padding-left: 32px;
	box-shadow: 0 2px 8px #f0f1f2;
	@media (max-width: 768px) {
		align-items: center;
		justify-content: center;
	}
`;

const Description = styled.span`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	font-size: 22px;
	font-weight: bold;
	padding: 0px 16px;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: #0c0c0c;
`;

const MenuRight = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	@media (max-width: 768px) {
		visibility: collapse;
	}
`;

const MenuLeft = styled.div`
	height: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

const MenuDiv = styled(Menu)`
	margin-right: 16px !important;
	margin-left: 16px !important;
	&.ant-menu-horizontal {
		border-bottom: none !important;
		height: 64px !important;
		line-height: 60px !important;

		& > .ant-menu-item,
		& > .ant-menu-submenu {
			border-top: 2px solid transparent !important;
			border-bottom: 2px solid transparent !important;

			&:hover {
				border-top: 2px solid #1890ff !important;
				border-bottom: 2px solid transparent !important;
			}
		}

		& > .ant-menu-submenu-open {
			border-top: 2px solid #1890ff !important;
			border-bottom: 2px solid transparent !important;
		}

		& > .ant-menu-item-selected {
			border-top: 2px solid #1890ff !important;
			border-bottom: 2px solid transparent !important;
		}
	}
`;

const Navbar = () => {
	return (
		<MenuBar>
			<MenuLeft>
				<img src="./logo512.png" height="40px" alt="Logo"></img>
				<Description>NLP Basics</Description>
			</MenuLeft>
			<MenuRight>
				<MenuDiv selectedKeys={["mail"]} mode="horizontal" className="nav">
					<SubMenu
						title={
							<span className="submenu-title-wrapper">
								<Icon type="book" />
								Chapters
							</span>
						}>
						<Menu.Item key="chapter:1">Tagging</Menu.Item>
						<Menu.Item key="chapter:2">String Similarities</Menu.Item>
						<Menu.Item key="chapter:3">Deep Neural Networks</Menu.Item>
						<Menu.Item key="chapter:4">Tools</Menu.Item>
						<Menu.Item key="chapter:5">Use Cases</Menu.Item>
					</SubMenu>
				</MenuDiv>
				<Button>Playground</Button>
			</MenuRight>
		</MenuBar>
	);
};

export default Navbar;
