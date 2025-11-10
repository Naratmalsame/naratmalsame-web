import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { useState, useEffect } from "react";

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat("bold"));
          setIsItalic(selection.hasFormat("italic"));
          setIsUnderline(selection.hasFormat("underline"));
        }
      });
    });
  }, [editor]);

  const insertHeading = (size: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const heading = $createHeadingNode(size);
        selection.insertNodes([heading]);
      }
    });
  };

  const insertQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const quote = $createQuoteNode();
        selection.insertNodes([quote]);
      }
    });
  };

  const insertLink = () => {
    const url = prompt("링크 URL을 입력하세요:");
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  const insertImage = () => {
    const url = prompt("이미지 URL을 입력하세요:");
    if (url) {
      // 이미지 삽입 기능 (추후 구현)
      alert("이미지 기능은 곧 추가됩니다!");
    }
  };

  const insertTable = () => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: "3",
      columns: "3",
    });
  };

  return (
    <div
      className="toolbar"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "nowrap",
      }}
    >
      <select
        className="toolbar-dropdown"
        onChange={(e) => {
          if (e.target.value === "h1") insertHeading("h1");
          else if (e.target.value === "h2") insertHeading("h2");
          else if (e.target.value === "h3") insertHeading("h3");
          e.target.value = "paragraph";
        }}
        defaultValue="paragraph"
      >
        <option value="paragraph">제목1</option>
        <option value="h1">제목 1</option>
        <option value="h2">제목 2</option>
        <option value="h3">제목 3</option>
      </select>

      <div className="toolbar-divider"></div>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={isBold ? "active" : ""}
        title="굵게 (Ctrl+B)"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={isItalic ? "active" : ""}
        title="기울임 (Ctrl+I)"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={isUnderline ? "active" : ""}
        title="밑줄 (Ctrl+U)"
      >
        <u>U</u>
      </button>

      <div className="toolbar-divider"></div>

      <button onClick={insertLink} title="링크 삽입">
        <span>🔗</span>
      </button>
      <button onClick={insertImage} title="이미지 삽입">
        <span>🖼️</span>
      </button>
      <button onClick={insertTable} title="표 삽입">
        <span>📊</span>
      </button>
      <button onClick={insertTable} title="파일 추가">
        <span>➕</span>
      </button>

      <div className="toolbar-divider"></div>

      <button onClick={insertQuote} title="인용구">
        <span>❝❞</span>
      </button>

      <div className="toolbar-divider"></div>

      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        title="글머리 기호"
      >
        <span style={{ fontSize: "16px" }}>⋮≡</span>
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        title="번호 매기기"
      >
        <span style={{ fontSize: "16px" }}>1≡</span>
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        title="들여쓰기 줄이기"
      >
        <span style={{ fontSize: "16px" }}>⫷≡</span>
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        title="들여쓰기 늘리기"
      >
        <span style={{ fontSize: "16px" }}>⫸≡</span>
      </button>
    </div>
  );
}
