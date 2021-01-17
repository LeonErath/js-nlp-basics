import Highlight, { defaultProps } from 'prism-react-renderer';
import vsDark from 'prism-react-renderer/themes/vsDark';

export const CodeBlock = ({ children, className }) => {
	const language = className
		? className.replace(/language-/, '')
		: 'javascript';

	return (
		<Highlight
			{...defaultProps}
			theme={vsDark}
			code={children}
			language={language}
		>
			{({ className, style, tokens, getLineProps, getTokenProps }) => (
				<>
					<pre
						className={className}
						style={{ ...style, padding: '20px' }}
					>
						{tokens.map((line, i) => (
							<div
								key={i}
								{...getLineProps({ line, key: i })}
								style={{ lineHeight: '26px' }}
							>
								{line.map((token, key) => (
									<span
										key={key}
										{...getTokenProps({ token, key })}
									/>
								))}
							</div>
						))}
					</pre>
				</>
			)}
		</Highlight>
	);
};
