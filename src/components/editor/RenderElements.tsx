
import React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';

export const renderElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;

  switch ((element as any).type) {
    case 'heading-one':
      return <h1 {...attributes} className="text-2xl font-bold my-3">{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes} className="text-xl font-bold my-2">{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes} className="text-lg font-bold my-2">{children}</h3>;
    case 'bulleted-list':
      return <ul {...attributes} className="list-disc pl-5 my-2">{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes} className="list-decimal pl-5 my-2">{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'block-quote':
      return <blockquote {...attributes} className="border-l-4 border-slate-500 pl-4 italic my-2 text-slate-300">{children}</blockquote>;
    case 'code-block':
      return (
        <pre {...attributes} className="bg-slate-800 p-3 rounded-md my-2 font-mono text-sm overflow-x-auto">
          <code>{children}</code>
        </pre>
      );
    case 'security-note':
      return (
        <div 
          {...attributes} 
          className="border-2 border-secure rounded-md p-3 my-3 bg-secure/10"
        >
          <div className="text-secure font-semibold">Security Note</div>
          <div>{children}</div>
        </div>
      );
    case 'vulnerability':
      return (
        <div 
          {...attributes} 
          className="border-2 border-threat rounded-md p-3 my-3 bg-threat/10"
        >
          <div className="text-threat font-semibold">Vulnerability</div>
          <div>{children}</div>
        </div>
      );
    case 'compliance':
      return (
        <div 
          {...attributes} 
          className="border-2 border-safe rounded-md p-3 my-3 bg-safe/10"
        >
          <div className="text-safe font-semibold">Compliance Item</div>
          <div>{children}</div>
        </div>
      );
    case 'warning':
      return (
        <div 
          {...attributes} 
          className="border-2 border-warning rounded-md p-3 my-3 bg-warning/10"
        >
          <div className="text-warning font-semibold">Warning</div>
          <div>{children}</div>
        </div>
      );
    default:
      return <p {...attributes} className="my-2">{children}</p>;
  }
};

export const renderLeaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf } = props;
  
  let styledChildren = children;
  
  if (leaf.bold) {
    styledChildren = <strong className="font-bold">{styledChildren}</strong>;
  }
  
  if (leaf.italic) {
    styledChildren = <em className="italic">{styledChildren}</em>;
  }
  
  if (leaf.underline) {
    styledChildren = <u className="underline">{styledChildren}</u>;
  }
  
  if (leaf.code) {
    styledChildren = <code className="bg-slate-800 text-slate-200 px-1 py-0.5 rounded font-mono text-sm">{styledChildren}</code>;
  }
  
  if (leaf.highlight) {
    styledChildren = <span className="bg-yellow-500/30 text-yellow-100">{styledChildren}</span>;
  }
  
  return <span {...attributes}>{styledChildren}</span>;
};
