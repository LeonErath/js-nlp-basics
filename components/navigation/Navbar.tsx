import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Avatar, Button, Dropdown, Menu, Spin } from 'antd';
import Logo from '../Logo';
import { A } from '../../styles/A';
import { maxWidth } from '../../styles/Theme';
import {
	BarsOutlined,
	DownOutlined,
	LoginOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { useUser } from '../../lib/user';
import { Breadcrumbs } from './Breadcrumbs';

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
	border-bottom: 1px solid #f0f1f2;

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
	const { user, loading } = useUser();

	const renderProfileDropdown = () => {
		if (loading) {
			return <Spin spinning={loading}></Spin>;
		}
		if (!user) {
			return (
				<div>
					<Button type="primary" shape="round">
						<Link href="/api/login">
							<a>
								<LoginOutlined /> Login
							</a>
						</Link>
					</Button>
					<Button style={{ marginLeft: '8px' }} shape="round">
						<Link href="/api/login">
							<a>Register</a>
						</Link>
					</Button>
				</div>
			);
		}

		const menu = (
			<Menu>
				<Menu.Item>
					<Link href="/profile">
						<a>
							<UserOutlined /> Profile
						</a>
					</Link>
				</Menu.Item>
			</Menu>
		);

		return (
			<Dropdown overlay={menu} placement="bottomCenter" arrow>
				<Button
					type="text"
					icon={
						<Avatar
							size="small"
							src={user.picture}
							style={{ marginRight: '4px' }}
						/>
					}
				>
					<Link href="/profile">
						<A>
							{user.name} <DownOutlined />{' '}
						</A>
					</Link>
				</Button>
			</Dropdown>
		);
	};

	return (
		<>
			<MenuBar>
				<MenuLeft>
					<Link href="/">
						<A>
							<Logo></Logo>
						</A>
					</Link>
				</MenuLeft>
				<MenuRight>
					<MenuDiv
						selectedKeys={['mail']}
						mode="horizontal"
						className="nav"
					>
						<SubMenu icon={<BarsOutlined />} title="Overview">
							<Menu.ItemGroup key="g1" title="Chapters">
								<Menu.Item key="chapter:1">Tagging</Menu.Item>
								<Menu.Item key="chapter:2">
									String Similarities
								</Menu.Item>
								<Menu.Item key="chapter:3">
									Deep Neural Networks
								</Menu.Item>
								<Menu.Item key="chapter:4">Tools</Menu.Item>
								<Menu.Item key="chapter:5">Use Cases</Menu.Item>
							</Menu.ItemGroup>
							<Menu.ItemGroup key="g1" title="Playgrounds">
								<Menu.Item key="playgrounds:1">
									<Link href="/playground/postagging">
										<a>Tagging</a>
									</Link>
								</Menu.Item>
								<Menu.Item key="playgrounds:2">
									<Link href="/playground/word2vec">
										<a>Word2Vec</a>
									</Link>
								</Menu.Item>
							</Menu.ItemGroup>
						</SubMenu>
					</MenuDiv>

					{renderProfileDropdown()}
				</MenuRight>
			</MenuBar>
			<Breadcrumbs />
		</>
	);
};

export default Navbar;
