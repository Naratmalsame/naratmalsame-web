/**
 * 툴바 상태 관리 커스텀 훅
 */

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";
import type { BlockType, ToolbarState } from "../types/editor";

export function useToolbarState(): ToolbarState {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
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
            setBlockType(tag as BlockType);
          } else {
            setBlockType("paragraph");
          }
        }
      });
    });
  }, [editor]);

  return {
    isBold,
    isItalic,
    isUnderline,
    blockType,
  };
}
