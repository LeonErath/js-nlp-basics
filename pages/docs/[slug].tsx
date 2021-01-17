import fs from 'fs';
import matter from 'gray-matter';
import hydrate from 'next-mdx-remote/hydrate';
import renderToString from 'next-mdx-remote/render-to-string';
import Head from 'next/head';
import path from 'path';
import Link from 'next/link';
import { Layout } from '../../components/docs/Layout';
import { postFilePaths, POSTS_PATH } from '../../util/mdxUtils';
import { Typography, Tag } from 'antd';
import { CodeBlock } from '../../components/docs/CodeBlock';

const { Paragraph, Title, Text } = Typography;

const pStyle: React.CSSProperties = { fontSize: '16px', lineHeight: '30px' };
const pStyleHeader: React.CSSProperties = {
	fontSize: '18px',
	lineHeight: '32px',
	marginBottom: '32px',
};

const components = {
	h1: (props) => <Title level={1} {...props} />,
	h2: (props) => <Title level={2} {...props} />,
	h3: (props) => <Title level={3} {...props} />,
	h4: (props) => <Title level={4} {...props} />,
	Head,
	a: Link,
	p: (props) => <Paragraph {...props} style={pStyle} />,
	code: CodeBlock,
};

const PostPage = ({ source, frontMatter }) => {
	const content = hydrate(source, { components });
	return (
		<Layout>
			<Head>
				<title>{frontMatter.title} 📔</title>
			</Head>
			<div>
				<Title>{frontMatter.title}</Title>
				<Paragraph style={pStyleHeader}>
					{frontMatter.description && (
						<Text type="secondary">{frontMatter.description}</Text>
					)}
					<br />
					{frontMatter.author && (
						<Text strong>written by {frontMatter.author}</Text>
					)}
					<br />
					{frontMatter.tags &&
						frontMatter.tags.map((t) => <Tag>{t}</Tag>)}
				</Paragraph>
			</div>
			<main>{content}</main>
		</Layout>
	);
};

export const getStaticProps = async ({ params }) => {
	const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`);
	const source = fs.readFileSync(postFilePath);

	const { content, data } = matter(source);

	const mdxSource = await renderToString(content, {
		components,
		// Optionally pass remark/rehype plugins
		mdxOptions: {
			remarkPlugins: [],
			rehypePlugins: [],
		},
		scope: data,
	});

	return {
		props: {
			source: mdxSource,
			frontMatter: data,
		},
	};
};

export const getStaticPaths = async () => {
	const paths = postFilePaths
		// Remove file extensions for page paths
		.map((path) => path.replace(/\.mdx?$/, ''))
		// Map the path into the static paths object required by Next.js
		.map((slug) => ({ params: { slug } }));

	return {
		paths,
		fallback: false,
	};
};

export default PostPage;
