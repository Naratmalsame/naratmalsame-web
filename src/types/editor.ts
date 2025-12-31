import type { EditorState } from "lexical";

/** 미리보기 타입 */
export type PreviewType = "embed" | "iframe" | "link";

/** 미리보기 데이터 구조 */
export interface Preview {
  type: PreviewType;
  src: string;
}

/**
 * 에디터 상태 변경 핸들러
 * @param editorState Lexical의 EditorState 객체
 */
export type EditorChangeHandler = (editorState: EditorState) => void;

/** 블록(문단, 제목) 타입 */
export type BlockType = "paragraph" | "h1" | "h2" | "h3" | "quote" | "code";

/**
 * 도구 모음 상태
 * 각 속성은 해당 서식이 적용 중인지 여부를 나타냅니다.
 * blockType: 현재 블록 타입
 */
export interface ToolbarState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  blockType: BlockType;
}

/**
 * 에디터 설정 옵션
 * @property namespace Lexical 에디터의 네임스페이스
 * @property onError 에러 발생 시 호출되는 콜백 함수
 */
export interface EditorConfig {
  namespace: string;
  onError: (error: Error) => void;
}
