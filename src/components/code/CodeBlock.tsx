import Highlight, { defaultProps } from "prism-react-renderer";
import { Theme } from "./Theme";

type Props = {
  code: string;
  className?: string;
  language: "javascript";
};

export const CodeBlock = ({ code, language }: Props) => {
  return (
    <Highlight
      {...defaultProps}
      theme={Theme.nightOwlLight}
      code={code}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            padding: "0px 16px",
            margin: "8px 0px",
            borderRadius: "8px",
          }}
        >
          {tokens.map((line, i) => (
            <div
              key={i}
              {...getLineProps({ line, key: i })}
              style={{ lineHeight: "20px" }}
            >
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
