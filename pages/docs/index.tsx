import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';
import path from 'path';
import { postFilePaths, POSTS_PATH } from '../../util/mdxUtils';
import { List, Space, Typography } from 'antd';
import React from 'react';
import { Layout } from '../../components/docs/Layout';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Props {
	posts: {
		filePath: string;
		data: {
			title: string;
			description: string;
		};
	}[];
}

const IconText = ({ icon, text }) => (
	<Space>
		{React.createElement(icon)}
		{text}
	</Space>
);

const Index = ({ posts }: Props) => {
	return (
		<Layout>
			<Title>Articles</Title>

			<List
				itemLayout="horizontal"
				dataSource={posts}
				renderItem={(item) => (
					<List.Item
						actions={[
							<IconText
								icon={StarOutlined}
								text="156"
								key="list-vertical-star-o"
							/>,
							<IconText
								icon={LikeOutlined}
								text="156"
								key="list-vertical-like-o"
							/>,
							<IconText
								icon={MessageOutlined}
								text="2"
								key="list-vertical-message"
							/>,
						]}
					>
						<Link
							as={`/docs/${item.filePath.replace(/\.mdx?$/, '')}`}
							href={'/docs/[slug]'}
						>
							<a style={{ width: '100%' }}>
								<List.Item.Meta
									title={item.data.title}
									description={item.data.description}
								/>
							</a>
						</Link>
					</List.Item>
				)}
			/>
		</Layout>
	);
};

export function getStaticProps() {
	const posts = postFilePaths(POSTS_PATH).map((filePath) => {
		const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
		const { content, data } = matter(source);

		return {
			content,
			data,
			filePath,
		};
	});

	return { props: { posts } };
}

export default Index;
