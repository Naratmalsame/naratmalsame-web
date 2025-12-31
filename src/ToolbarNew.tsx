/**
 * Lexical エディタのツールバーコンポーネント
 * テキストフォーマット、ブロック操作、など一般的なエディタ操作をサポート
 */

import {
  useEffect,
  useState,
  useCallback,
  type ChangeEvent,
  type ReactElement,
  type FC,
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

// ============================================================================
// Types
// ============================================================================

interface ToolbarState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  blockType: string;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Lexical エディタのツールバーコンポーネント
 */
const ToolbarNew: FC = (): ReactElement => {
  const [editor] = useLexicalComposerContext();
  const [toolbarState, setToolbarState] = useState<ToolbarState>({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    blockType: "paragraph",
  });

  // ============================================================================
  // Effect Hooks
  // ============================================================================

  useEffect(() => {
    return editor.registerUpdateListener(
      ({ editorState }: { editorState: EditorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setToolbarState((prev) => ({
              ...prev,
              isBold: selection.hasFormat("bold"),
              isItalic: selection.hasFormat("italic"),
              isUnderline: selection.hasFormat("underline"),
            }));

            // 現在選択されたノードのブロックタイプを検出
            const anchorNode = selection.anchor.getNode();
            const element =
              anchorNode.getKey() === "root"
                ? anchorNode
                : anchorNode.getTopLevelElementOrThrow();

            if ($isHeadingNode(element)) {
              const tag = element.getTag();
              setToolbarState((prev) => ({ ...prev, blockType: tag }));
            } else {
              setToolbarState((prev) => ({ ...prev, blockType: "paragraph" }));
            }
          }
        });
      }
    );
  }, [editor]);

  // ============================================================================
  // Handler Functions
  // ============================================================================

  const insertHeading = useCallback(
    (size: "h1" | "h2" | "h3") => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const heading = $createHeadingNode(size);
          selection.insertNodes([heading]);
        }
      });
    },
    [editor]
  );

  const insertQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const quote = $createQuoteNode();
        selection.insertNodes([quote]);
      }
    });
  }, [editor]);

  const insertLink = useCallback(() => {
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
  }, [editor]);

  const insertImage = useCallback(() => {
    const url = prompt("이미지 URL을 입력하세요:");
    if (!url) return;
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
  }, [editor]);

  const insertFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
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
  }, [editor]);

  const insertTable = useCallback(
    () => editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: "3", columns: "3" }),
    [editor]
  );

  const undo = useCallback(
    () => editor.dispatchCommand(UNDO_COMMAND, undefined),
    [editor]
  );

  const redo = useCallback(
    () => editor.dispatchCommand(REDO_COMMAND, undefined),
    [editor]
  );

  const formatElement = useCallback(
    (format: ElementFormatType) =>
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format),
    [editor]
  );

  const handleBlockTypeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value === "h1") insertHeading("h1");
      else if (value === "h2") insertHeading("h2");
      else if (value === "h3") insertHeading("h3");
    },
    [insertHeading]
  );

  const formatTextBold = useCallback(
    () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"),
    [editor]
  );

  const formatTextItalic = useCallback(
    () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic"),
    [editor]
  );

  const formatTextUnderline = useCallback(
    () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline"),
    [editor]
  );

  const insertUnorderedList = useCallback(
    () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    [editor]
  );

  const insertOrderedList = useCallback(
    () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    [editor]
  );

  // ============================================================================
  // Render
  // ============================================================================

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
      {/* ブロックタイプセレクト */}
      <select
        className="toolbar-dropdown"
        onChange={handleBlockTypeChange}
        value={toolbarState.blockType}
      >
        <option value="paragraph">문단</option>
        <option value="h1">제목 1</option>
        <option value="h2">제목 2</option>
        <option value="h3">제목 3</option>
      </select>

      <div className="toolbar-divider" />

      {/* テキストフォーマット */}
      <button
        onClick={formatTextBold}
        className={toolbarState.isBold ? "active" : ""}
        title="굵게 (Ctrl+B)"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={formatTextItalic}
        className={toolbarState.isItalic ? "active" : ""}
        title="기울임 (Ctrl+I)"
      >
        <em>I</em>
      </button>
      <button
        onClick={formatTextUnderline}
        className={toolbarState.isUnderline ? "active" : ""}
        title="밑줄 (Ctrl+U)"
      >
        <u>U</u>
      </button>

      {/* 취소/다시 실행 */}
      <button onClick={undo} title="실행 취소">
        ⎌
      </button>
      <button onClick={redo} title="다시 실행">
        ↻
      </button>

      <div className="toolbar-divider" />

      {/* 삽입 버튼 */}
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

      {/* 목록 버튼 */}
      <button onClick={insertUnorderedList} title="글머리 기호">
        <img src={BulletedImage} alt="글머리 기호 아이콘" />
      </button>
      <button onClick={insertOrderedList} title="번호 매기기">
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
};

ToolbarNew.displayName = "ToolbarNew";

export default ToolbarNew;
