
import React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';

export const renderElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'code-block':
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      );
    case 'security-note':
      return (
        <div 
          {...attributes} 
          className="security-border rounded-md p-3 my-3"
        >
          <div className="text-secure font-semibold">Security Note</div>
          <div>{children}</div>
        </div>
      );
    case 'vulnerability':
      return (
        <div 
          {...attributes} 
          className="threat-border rounded-md p-3 my-3"
        >
          <div className="text-threat font-semibold">Vulnerability</div>
          <div>{children}</div>
        </div>
      );
    case 'compliance':
      return (
        <div 
          {...attributes} 
          className="safe-border rounded-md p-3 my-3"
        >
          <div className="text-safe font-semibold">Compliance Item</div>
          <div>{children}</div>
        </div>
      );
    case 'warning':
      return (
        <div 
          {...attributes} 
          className="warning-border rounded-md p-3 my-3"
        >
          <div className="text-warning font-semibold">Warning</div>
          <div>{children}</div>
        </div>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export const renderLeaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf } = props;
  
  let styledChildren = children;
  
  if (leaf.bold) {
    styledChildren = <strong>{styledChildren}</strong>;
  }
  
  if (leaf.italic) {
    styledChildren = <em>{styledChildren}</em>;
  }
  
  if (leaf.underline) {
    styledChildren = <u>{styledChildren}</u>;
  }
  
  if (leaf.code) {
    styledChildren = <code className="bg-muted px-1 py-0.5 rounded">{styledChildren}</code>;
  }
  
  if (leaf.highlight) {
    styledChildren = <span className="bg-yellow-200 dark:bg-yellow-800">{styledChildren}</span>;
  }
  
  return <span {...attributes}>{styledChildren}</span>;
};
