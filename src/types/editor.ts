/**
 * 에디터 관련 타입 정의
 */

import type { EditorState } from "lexical";

export type PreviewType = "embed" | "iframe" | "link";

export interface Preview {
  type: PreviewType;
  src: string;
}

export interface EditorChangeHandler {
  (editorState: EditorState): void;
}

export type BlockType = "paragraph" | "h1" | "h2" | "h3";

export interface ToolbarState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  blockType: BlockType;
}
