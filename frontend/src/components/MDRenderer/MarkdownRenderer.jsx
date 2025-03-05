import ReactMarkdown from "react-markdown";

//remark plugins
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

//rehype plugins
import rehypeKatex from "rehype-katex";

//syntax highlighter
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

//katex css
import "katex/dist/katex.min.css";

//markdown css
import "./MarkdownRenderer.css";

const components = {
  h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
  p: ({ children }) => <p className="md-p">{children}</p>,
  strong: ({ children }) => <strong className="md-strong">{children}</strong>,
  em: ({ children }) => <em className="md-em">{children}</em>,
  a: ({ children, ...props }) => (
    <a className="md-a" {...props}>
      {children}
    </a>
  ),
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={coy}
        language={match[1]}
        PreTag="div"
        customStyle={{
          border: "1px solidrgb(172, 18, 18)", // 얇은 테두리 추가
          borderRadius: "4px", // 모서리 둥글게
          padding: "0.5em", // 내부 여백
          margin: "1em 0", // 상하 여백
          boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.05)", // 미묘한 그림자
          backgroundColor: "#fefefe",
        }}
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
