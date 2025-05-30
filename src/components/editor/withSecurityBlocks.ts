
import { Editor, Transforms, Element, Node } from 'slate';

export const withSecurityBlocks = (editor: Editor): Editor => {
  const { insertBreak, isVoid } = editor;

  editor.insertBreak = () => {
    const { selection } = editor;
    
    if (selection) {
      const nodeEntries = Editor.nodes(editor, {
        match: n => 
          !Editor.isEditor(n) && 
          Element.isElement(n) && 
          ['security-note', 'vulnerability', 'compliance', 'warning'].includes((n as any).type as string),
        at: selection,
      });
      
      const currentNode = Array.from(nodeEntries)[0];
      
      if (currentNode) {
        const [node, path] = currentNode;
        const end = Editor.end(editor, path);
        
        // If at the end of the security block, exit it
        if (JSON.stringify(selection.focus.path) === JSON.stringify(end.path) && 
            selection.focus.offset === end.offset) {
          Transforms.insertNodes(editor, { 
            type: 'paragraph', 
            children: [{ text: '' }] 
          }, { at: Editor.after(editor, path) });
          Transforms.select(editor, Editor.after(editor, path));
          return;
        }
      }
    }
    
    insertBreak();
  };

  // Ensure security blocks have proper structure
  const normalizeNode = editor.normalizeNode;
  editor.normalizeNode = ([node, path]) => {
    if (Element.isElement(node) && 
        ['security-note', 'vulnerability', 'compliance', 'warning'].includes((node as any).type as string)) {
      // Ensure security blocks have at least one paragraph child
      if (node.children.length === 0) {
        Transforms.insertNodes(
          editor,
          { text: '' },
          { at: [...path, 0] }
        );
      }
      
      // Add necessary styling attributes if not present
      if (!(node as any).className) {
        const className = 
          (node as any).type === 'security-note' ? 'security-border p-3 rounded-md my-2' :
          (node as any).type === 'vulnerability' ? 'threat-border p-3 rounded-md my-2' :
          (node as any).type === 'compliance' ? 'safe-border p-3 rounded-md my-2' :
          (node as any).type === 'warning' ? 'warning-border p-3 rounded-md my-2' : '';
        
        Transforms.setNodes(
          editor,
          { className } as Partial<Element>,
          { at: path }
        );
      }
    }
    
    normalizeNode([node, path]);
  };

  return editor;
};
