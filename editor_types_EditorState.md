# EditorState(Lexical) 타입 간단 설명

## 정의
- `EditorState`는 lexical 라이브러리에서 제공하는 타입입니다.
- import 예시:
  ```ts
  import type { EditorState } from "lexical";
  ```

## 설명
- 에디터의 현재 상태(문서 구조, 선택, 포맷 등)를 나타내는 Lexical의 핵심 타입입니다.
- 주로 에디터 상태 변경 핸들러(`EditorChangeHandler`)의 인자로 사용됩니다.
- 직접 인스턴스를 생성하지 않고, Lexical 에디터 내부에서 관리됩니다.

## 참고
- 공식 문서: https://lexical.dev/docs/api/classes/editorstate
