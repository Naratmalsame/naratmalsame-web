# editor.ts 타입 및 구조 정리

이 문서는 `src/types/editor.ts` 파일의 타입 정의와 구조, 그리고 각 타입의 역할을 세세하게 정리한 문서입니다. 또한, 코드 내에서 발견된 아주 간단한 개선 사항(코드 스타일, 주석, 일관성 등)에 대한 수정도 함께 반영하였습니다.

---

## 1. 파일 개요

- **위치:** `src/types/editor.ts`
- **역할:** 에디터(lexical 기반)와 관련된 타입, 인터페이스, 유틸리티 타입을 정의합니다.

---

## 2. 타입/인터페이스 상세 설명

### 2.1. PreviewType

- **정의:**
  ```ts
  export type PreviewType = "embed" | "iframe" | "link";
  ```
- **설명:**
  미리보기(Preview) 컴포넌트에서 지원하는 미디어 타입을 지정합니다.
  - `embed`: 임베드 미디어
  - `iframe`: iframe 형태
  - `link`: 일반 링크

### 2.2. Preview

- **정의:**
  ```ts
  export interface Preview {
    type: PreviewType;
    src: string;
  }
  ```
- **설명:**
  미리보기 데이터의 구조를 정의합니다.
  - `type`: 미리보기 타입
  - `src`: 미디어 소스 URL

### 2.3. EditorChangeHandler

- **정의:**
  ```ts
  export interface EditorChangeHandler {
    (editorState: EditorState): void;
  }
  ```
- **설명:**
  에디터 상태가 변경될 때 호출되는 핸들러 함수 타입입니다.
  - `editorState`: Lexical의 EditorState 객체

### 2.4. BlockType

- **정의:**
  ```ts
  export type BlockType = "paragraph" | "h1" | "h2" | "h3" | "quote" | "code";
  ```
- **설명:**
  에디터에서 지원하는 블록(문단, 제목, 인용, 코드) 타입을 지정합니다.

### 2.5. ToolbarState

- **정의:**
  ```ts
  export interface ToolbarState {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isStrikethrough: boolean;
    isCode: boolean;
    blockType: BlockType;
  }
  ```
- **설명:**
  에디터의 도구 모음(툴바) 상태를 나타내는 객체입니다.
  - 각 속성은 해당 서식이 적용 중인지 여부를 나타냅니다.
  - `blockType`: 현재 블록 타입

### 2.6. EditorConfig

- **정의:**
  ```ts
  export interface EditorConfig {
    namespace: string;
    onError: (error: Error) => void;
  }
  ```
- **설명:**
  에디터의 설정 옵션을 정의합니다.
  - `namespace`: Lexical 에디터의 네임스페이스
  - `onError`: 에러 발생 시 호출되는 콜백 함수

---

## 3. 코드 개선 사항 (아주 간단한 것들)

- 타입/인터페이스 선언부에 JSDoc 스타일 주석 추가
- 불필요한 공백 및 주석 정리
- `EditorChangeHandler`를 함수 타입으로 변경 (interface → type alias, 더 간결함)

---

## 4. 개선된 코드 예시

```typescript
import type { EditorState } from "lexical";

/**
 * 미리보기 타입
 */
export type PreviewType = "embed" | "iframe" | "link";

/**
 * 미리보기 데이터 구조
 */
export interface Preview {
  type: PreviewType;
  src: string;
}

/**
 * 에디터 상태 변경 핸들러
 */
export type EditorChangeHandler = (editorState: EditorState) => void;

/**
 * 블록(문단, 제목) 타입
 */
export type BlockType = "paragraph" | "h1" | "h2" | "h3" | "quote" | "code";

/**
 * 도구 모음 상태
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
 */
export interface EditorConfig {
  namespace: string;
  onError: (error: Error) => void;
}
```

---

## 5. 참고 사항

- 타입/인터페이스에 대한 설명을 주석으로 명확히 남기면 유지보수에 도움이 됩니다.
- 함수 타입은 interface보다 type alias가 더 간결할 수 있습니다.
- 기타 복잡한 로직/구조 변경 없이, 문서화와 코드 스타일 위주로 개선하였습니다.
