import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
export const slug = text => String(text).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function MathText({children,article=false,idPrefix=''}) {
  return <div className={article?'prose article':'prose'}><ReactMarkdown remarkPlugins={[remarkMath,remarkGfm]} rehypePlugins={[[rehypeKatex,{strict:'ignore',throwOnError:false}]]} components={{h2:({children})=><h2 id={`${idPrefix}${slug(children)}`}>{children}</h2>,table:({children})=><div className="table-scroll"><table>{children}</table></div>,a:({href,children})=><a href={href} rel="noreferrer">{children}</a>}}>{children}</ReactMarkdown></div>;
}
