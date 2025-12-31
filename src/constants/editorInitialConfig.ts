/**
 * 에디터 테마 및 초기 설정
 */

import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ForeignWordNode } from "../shared/nodes/ForeignWordNode";

/**
 * 코드 하이라이트 토큰 매핑
 */
const CODE_HIGHLIGHT_TOKENS = {
  atrule: "editor-token-atrule",
  attr: "editor-token-attr",
  boolean: "editor-token-boolean",
  builtin: "editor-token-builtin",
  cdata: "editor-token-cdata",
  char: "editor-token-char",
  class: "editor-token-class",
  comment: "editor-token-comment",
  constant: "editor-token-constant",
  deleted: "editor-token-deleted",
  doctype: "editor-token-doctype",
  entity: "editor-token-entity",
  function: "editor-token-function",
  important: "editor-token-important",
  inserted: "editor-token-inserted",
  keyword: "editor-token-keyword",
  namespace: "editor-token-namespace",
  number: "editor-token-number",
  operator: "editor-token-operator",
  prolog: "editor-token-prolog",
  property: "editor-token-property",
  punctuation: "editor-token-punctuation",
  regex: "editor-token-regex",
  selector: "editor-token-selector",
  string: "editor-token-string",
  symbol: "editor-token-symbol",
  tag: "editor-token-tag",
  url: "editor-token-url",
  variable: "editor-token-variable",
} as const;

/**
 * 에디터 초기 설정 생성
 */
export function createEditorInitialConfig(): InitialConfigType {
  return {
    namespace: "AdvancedEditor",
    theme: {
      paragraph: "editor-paragraph",
      heading: {
        h1: "editor-heading-h1",
        h2: "editor-heading-h2",
        h3: "editor-heading-h3",
      },
      list: {
        nested: {
          listitem: "editor-nested-listitem",
        },
        ol: "editor-list-ol",
        ul: "editor-list-ul",
        listitem: "editor-listitem",
        checklist: "editor-checklist",
      },
      quote: "editor-quote",
      code: "editor-code",
      codeHighlight: CODE_HIGHLIGHT_TOKENS,
      link: "editor-link",
      text: {
        bold: "editor-text-bold",
        italic: "editor-text-italic",
        underline: "editor-text-underline",
        strikethrough: "editor-text-strikethrough",
        code: "editor-text-code",
      },
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      ForeignWordNode,
    ],
    onError: (error: Error) => {
      console.error("[Editor Error]:", error.message);
    },
  };
}
