import fs from 'fs';
import path from 'path';

// POSTS_PATH is useful when you want to get the path to a specific file
export const POSTS_PATH = path.join(process.cwd(), 'docs');

export const NLP_POSTS_PATH = path.join(process.cwd(), 'docs/nlp');

// postFilePaths is the list of all mdx files inside the POSTS_PATH directory
export const postFilePaths = (path:string) =>
	fs
		.readdirSync(path)
		// Only include md(x) files
		.filter((path) => /\.mdx?$/.test(path));
