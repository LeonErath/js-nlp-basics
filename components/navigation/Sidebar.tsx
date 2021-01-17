import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'antd';
import { useRouter } from 'next/router';
import {
	BookOutlined,
	ContainerOutlined,
	HomeOutlined,
	PlayCircleOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;

const Sidebar = () => {
	const [currentPage, setCurrentPage] = useState('home');
	const router = useRouter();

	useEffect(() => {
		console.log(router.pathname, router.query);
		if (router.pathname === '/') {
			return setCurrentPage('home');
		}
		if (router.pathname.includes('playground')) {
			return setCurrentPage('playground');
		}
		if (router.pathname.includes('docs')) {
			return setCurrentPage('docs');
		}
		if (router.pathname.includes('nlp')) {
			if (router.query.slug?.includes('getting-started')) {
				return setCurrentPage('chapter:1');
			}
			if (router.query.slug?.includes('tagging')) {
				return setCurrentPage('chapter:2');
			}
			if (router.query.slug?.includes('string-similarities')) {
				return setCurrentPage('chapter:3');
			}
		}
		return setCurrentPage('');
	}, [router.pathname, router.query]);

	return (
		<Menu
			onClick={(e) => console.log(e)}
			selectedKeys={[currentPage]}
			defaultOpenKeys={['sub1']}
			mode="inline"
			style={{ maxWidth: '240px', paddingTop: '16px' }}
		>
			<Menu.Item key="home" icon={<HomeOutlined />}>
				<Link href="/">
					<a>Home</a>
				</Link>
			</Menu.Item>
			<SubMenu key="sub1" icon={<BookOutlined />} title="Theory">
				<Menu.ItemGroup key="g1" title="Chapters">
					<Menu.Item key="chapter:1">
						<Link href="/nlp/getting-started">
							<a>Getting Started</a>
						</Link>
					</Menu.Item>
					<Menu.Item key="chapter:2">
						<Link href="/nlp/tagging">
							<a>Tagging</a>
						</Link>
					</Menu.Item>
					<Menu.Item key="chapter:3">
						<Link href="/nlp/string-similarities">
							<a>String Similarities</a>
						</Link>
					</Menu.Item>
					<Menu.Item key="chapter:4">Deep Neural Networks</Menu.Item>
					<Menu.Item key="chapter:5">Tools</Menu.Item>
					<Menu.Item key="chapter:6">Use Cases</Menu.Item>
				</Menu.ItemGroup>
			</SubMenu>

			<Menu.Item key="playground" icon={<PlayCircleOutlined />}>
				<Link href="/playground">
					<a>Playgrounds</a>
				</Link>
			</Menu.Item>
			<Menu.Item key="docs" icon={<ContainerOutlined />}>
				<Link href="/docs">
					<a>Articles</a>
				</Link>
			</Menu.Item>
		</Menu>
	);
};

export default Sidebar;
