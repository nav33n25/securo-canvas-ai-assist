
import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type ParagraphElement = {
  type: 'paragraph';
  children: CustomText[];
};

export type HeadingOneElement = {
  type: 'heading-one';
  children: CustomText[];
};

export type HeadingTwoElement = {
  type: 'heading-two';
  children: CustomText[];
};

export type HeadingThreeElement = {
  type: 'heading-three';
  children: CustomText[];
};

export type BulletedListElement = {
  type: 'bulleted-list';
  children: CustomText[];
};

export type NumberedListElement = {
  type: 'numbered-list';
  children: CustomText[];
};

export type ListItemElement = {
  type: 'list-item';
  children: CustomText[];
};

export type BlockQuoteElement = {
  type: 'block-quote';
  children: CustomText[];
};

export type CodeBlockElement = {
  type: 'code-block';
  children: CustomText[];
};

export type SecurityNoteElement = {
  type: 'security-note';
  children: CustomText[];
};

export type VulnerabilityElement = {
  type: 'vulnerability';
  children: CustomText[];
};

export type ComplianceElement = {
  type: 'compliance';
  children: CustomText[];
};

export type WarningElement = {
  type: 'warning';
  children: CustomText[];
};

export type ControlElement = {
  type: 'control';
  children: CustomText[];
};

export type CustomElement =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | BlockQuoteElement
  | CodeBlockElement
  | SecurityNoteElement
  | VulnerabilityElement
  | ComplianceElement
  | WarningElement
  | ControlElement;

export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  highlight?: boolean;
};

export type CustomText = FormattedText;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
