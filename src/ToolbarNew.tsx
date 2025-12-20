import {
  useEffect,
  useState,
  type ChangeEvent,
  type ReactElement,
} from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getRoot,
  $createTextNode,
  type EditorState,
  type ElementFormatType,
} from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import { TOGGLE_LINK_COMMAND, LinkNode } from "@lexical/link";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";

import LinkImage from "./assets/link.svg";
import ImageImage from "./assets/image.svg";
import FolderImage from "./assets/folder.svg";
import TableImage from "./assets/table.svg";
import BulletedImage from "./assets/bulleted.svg";
import NumberImage from "./assets/number.svg";
import LeftDecImage from "./assets/left_dec.svg";
import IndentDecImage from "./assets/indent_dec.svg";

export default function ToolbarNew(): ReactElement {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState<string>("paragraph");

  useEffect(() => {
    return editor.registerUpdateListener(
      ({ editorState }: { editorState: EditorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));

            // 현재 선택된 노드의 블록 타입 감지
            const anchorNode = selection.anchor.getNode();
            const element =
              anchorNode.getKey() === "root"
                ? anchorNode
                : anchorNode.getTopLevelElementOrThrow();

            if ($isHeadingNode(element)) {
              const tag = element.getTag();
              setBlockType(tag);
            } else {
              setBlockType("paragraph");
            }
          }
        });
      }
    );
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
    if (!url) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      } else {
        const root = $getRoot();
        const link = new LinkNode(url);
        const text = $createTextNode(url);
        link.append(text);
        root.append(link);
      }
    });
  };

  const insertImage = () => {
    const url = prompt("이미지 URL을 입력하세요:");
    if (!url) return;
    // ImageNode는 등록되어 있지 않으므로 링크로 삽입
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const markdown = `![이미지](${url})`;
        selection.insertText(markdown);
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      } else {
        const root = $getRoot();
        const link = new LinkNode(url);
        const text = $createTextNode("[이미지]");
        link.append(text);
        root.append(link);
      }
    });
  };

  const insertFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files && target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      editor.update(() => {
        const root = $getRoot();
        const link = new LinkNode(url);
        const text = $createTextNode(file.name || "첨부파일");
        link.append(text);
        root.append(link);
      });
    };
    input.click();
  };

  const insertTable = () =>
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: "3", columns: "3" });
  const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined);
  const formatElement = (format: ElementFormatType) =>
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);

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
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          const value = e.target.value;
          if (value === "h1") insertHeading("h1");
          else if (value === "h2") insertHeading("h2");
          else if (value === "h3") insertHeading("h3");
        }}
        value={blockType}
      >
        <option value="paragraph">문단</option>
        <option value="h1">제목 1</option>
        <option value="h2">제목 2</option>
        <option value="h3">제목 3</option>
      </select>

      <div className="toolbar-divider" />

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

      <button onClick={undo} title="실행 취소">
        ⎌
      </button>
      <button onClick={redo} title="다시 실행">
        ↻
      </button>

      <div className="toolbar-divider" />

      <button onClick={insertLink} title="링크 삽입">
        <img src={LinkImage} alt="링크 아이콘" />
      </button>
      <button onClick={insertImage} title="이미지 삽입">
        <img src={ImageImage} alt="이미지 아이콘" />
      </button>
      <button onClick={insertFile} title="파일 추가">
        <img src={FolderImage} alt="파일 아이콘" />
      </button>
      <button onClick={insertTable} title="표 삽입">
        <img src={TableImage} alt="표 아이콘" />
      </button>
      <button onClick={insertQuote} title="인용구">
        <span>❞</span>
      </button>

      <div className="toolbar-divider" />

      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        title="글머리 기호"
      >
        <img src={BulletedImage} alt="글머리 기호 아이콘" />
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        title="번호 매기기"
      >
        <img src={NumberImage} alt="번호 매기기 아이콘" />
      </button>
      <button
        onClick={() => formatElement("outdent" as ElementFormatType)}
        title="들여쓰기 줄이기"
      >
        <img src={LeftDecImage} alt="들여쓰기 줄이기 아이콘" />
      </button>
      <button
        onClick={() => formatElement("indent" as ElementFormatType)}
        title="들여쓰기 늘리기"
      >
        <img src={IndentDecImage} alt="들여쓰기 늘리기 아이콘" />
      </button>
    </div>
  );
}
