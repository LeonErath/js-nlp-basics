import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const Container = styled.div`
	height: 26px;
	display: flex;
	align-items: center;
	background: #f8f8f8;
	width: 100%;
	padding-right: 32px;
	padding-left: 32px;
	border-bottom: 1px solid #f0f1f2;
`;

export const Breadcrumbs = () => {
	const router = useRouter();
	const [breadcrumbs, setBreadcrumbs] = useState([]);

	useEffect(() => {
		if (router) {
			const linkPath = router.asPath.split('/');
			linkPath.shift();

			const pathArray = linkPath
				.filter((p) => p.length > 0)
				.map((path, i) => {
					return {
						path: path,
						href: '/' + linkPath.slice(0, i + 1).join('/'),
					};
				});

			setBreadcrumbs(pathArray);
		}
	}, [router]);

	const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1);

	if (breadcrumbs.length < 1) {
		return null;
	}

	return (
		<Container>
			<Breadcrumb separator=">">
				<Breadcrumb.Item>
					<Link href="/">
						<a>
							<HomeOutlined />
						</a>
					</Link>
				</Breadcrumb.Item>
				{breadcrumbs.map((breadcrumb) => (
					<Breadcrumb.Item>
						<Link href={breadcrumb.href}>
							<a>{capitalize(breadcrumb.path)}</a>
						</Link>
					</Breadcrumb.Item>
				))}
			</Breadcrumb>
		</Container>
	);
};
