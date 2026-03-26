# EditorChangeHandler 타입 설명

## 정의

```ts
export type EditorChangeHandler = (editorState: EditorState) => void;
```

## 설명

- 에디터 상태가 변경될 때 호출되는 핸들러 함수 타입입니다.
  - `editorState`: Lexical의 EditorState 객체
