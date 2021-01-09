import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { Button, Menu } from "antd";
import Logo from "./Logo";
import { A } from "../styles/A";
import { maxWidth } from "../styles/Theme";
import { BookOutlined } from "@ant-design/icons";

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
	@media (max-width: ${maxWidth.SMALL}) {
		align-items: center;
		justify-content: center;
	}
`;

const MenuRight = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	@media (max-width: ${maxWidth.SMALL}) {
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
				<Link href="/">
					<A>
						<Logo></Logo>
					</A>
				</Link>
			</MenuLeft>
			<MenuRight>
				<MenuDiv selectedKeys={["mail"]} mode="horizontal" className="nav">
					<SubMenu
						title={
							<span className="submenu-title-wrapper">
								<BookOutlined />
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
				<Button>
					<Link href="/playground">
						<a>Playground</a>
					</Link>
				</Button>
			</MenuRight>
		</MenuBar>
	);
};

export default Navbar;
