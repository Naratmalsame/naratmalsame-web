import { useState } from "react";
import type { EditorState } from "lexical";
import { $getRoot } from "lexical";
import EditorShellWithSentencePlugin from "./components/EditorShellWithSentencePlugin";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ForeignWordNode } from "./shared/nodes/ForeignWordNode";

/**
 * 문장 기반 외래어 탐지 플러그인 데모
 *
 * 사용 방법:
 * 1. 텍스트를 입력하세요 (예: "오늘 커피를 마셨다. 컴퓨터로 인터넷을 했다!")
 * 2. 문장 종결 표현(. ! ?)을 입력하면 해당 문장이 분석됩니다
 * 3. 외래어가 시차를 두고 순차적으로 하이라이트됩니다
 * 4. 하이라이트된 외래어를 클릭하면 순우리말로 변경할 수 있습니다
 */
export default function AppWithSentencePlugin() {
  const codeHighlight = {
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
  };

  const initialEditorConfig = {
    namespace: "NaratEditorWithSentencePlugin",
    theme: {
      ltr: "ltr",
      rtl: "rtl",
      paragraph: "editor-paragraph",
      quote: "editor-quote",
      heading: {
        h1: "editor-heading-h1",
        h2: "editor-heading-h2",
        h3: "editor-heading-h3",
        h4: "editor-heading-h4",
        h5: "editor-heading-h5",
        h6: "editor-heading-h6",
      },
      list: {
        nested: {
          listitem: "editor-nested-listitem",
        },
        ol: "editor-list-ol",
        ul: "editor-list-ul",
        listitem: "editor-listitem",
        listitemChecked: "editor-listitem-checked",
        listitemUnchecked: "editor-listitem-unchecked",
      },
      hashtag: "editor-hashtag",
      image: "editor-image",
      link: "editor-link",
      text: {
        bold: "editor-text-bold",
        code: "editor-text-code",
        italic: "editor-text-italic",
        strikethrough: "editor-text-strikethrough",
        subscript: "editor-text-subscript",
        superscript: "editor-text-superscript",
        underline: "editor-text-underline",
        underlineStrikethrough: "editor-text-underlineStrikethrough",
      },
      code: "editor-code",
      codeHighlight,
      table: "editor-table",
      tableCell: "editor-table-cell",
      tableCellHeader: "editor-table-cell-header",
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      ForeignWordNode, // 필수!
    ],
    onError: (error: Error) => {
      console.error("[Editor Error]", error);
    },
  };

  const [plainText, setPlainText] = useState<string>("");

  const handleEditorChange = (state: EditorState) => {
    state.read(() => {
      const root = $getRoot();
      const text = root.getTextContent();
      setPlainText(text);
    });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2em", marginBottom: "10px" }}>
          나랏말싸미 에디터 (문장 기반 외래어 탐지)
        </h1>
        <p style={{ color: "#666", fontSize: "1.1em" }}>
          문장 종결 표현(. ! ?)을 입력하면 외래어가 시차를 두고 하이라이트됩니다
        </p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ fontSize: "1.5em", marginBottom: "15px" }}>📝 에디터</h2>
        <EditorShellWithSentencePlugin
          initialConfig={initialEditorConfig}
          onChange={handleEditorChange}
        />
        <div
          style={{
            marginTop: "15px",
            padding: "15px",
            backgroundColor: "#f0f8ff",
            borderRadius: "8px",
            border: "1px solid #d0e8ff",
          }}
        >
          <strong>💡 사용 팁:</strong>
          <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
            <li>문장을 입력하고 마침표(.), 느낌표(!), 물음표(?)로 끝내세요</li>
            <li>
              외래어가 발견되면 500ms~2000ms 사이에 순차적으로 하이라이트됩니다
            </li>
            <li>
              빨간색으로 표시된 외래어를 클릭하면 순우리말로 변경할 수 있습니다
            </li>
            <li>각 문장에는 고유한 data-sentence-id가 부여됩니다</li>
          </ul>
        </div>
      </div>

      <div
        style={{
          padding: "15px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ fontSize: "1.2em", marginBottom: "10px" }}>
          📊 텍스트 통계
        </h3>
        <p>전체 글자 수: {plainText.length}</p>
        <p>공백 제외: {plainText.replace(/\s/g, "").length}</p>
      </div>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#fffef0",
          borderRadius: "8px",
          border: "1px solid #ffd700",
        }}
      >
        <h3 style={{ fontSize: "1.3em", marginBottom: "10px" }}>
          🎯 테스트 예제
        </h3>
        <p style={{ marginBottom: "10px" }}>
          다음 텍스트를 복사해서 에디터에 붙여넣어 보세요:
        </p>
        <div
          style={{
            padding: "15px",
            backgroundColor: "#fff",
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontFamily: "monospace",
            marginBottom: "10px",
          }}
        >
          오늘 아침에 커피를 마셨다. 그리고 컴퓨터로 인터넷 서핑을 했다!
          스마트폰으로 메시지를 보냈나? 저녁에는 파일을 정리하고 프린터로 문서를
          출력했어요.
        </div>
        <p>
          <strong>예상 동작:</strong> 각 문장의 외래어(커피, 컴퓨터, 인터넷,
          스마트폰, 메시지, 파일, 프린터)가 시간차를 두고 하이라이트됩니다.
        </p>
      </div>
    </div>
  );
}
