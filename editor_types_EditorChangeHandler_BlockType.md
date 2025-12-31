# EditorChangeHandler 타입 설명

## 정의

```ts
export type EditorChangeHandler = (editorState: EditorState) => void;
```

## 설명

- 에디터 상태가 변경될 때 호출되는 핸들러 함수 타입입니다.
  - `editorState`: Lexical의 EditorState 객체

---

# BlockType 타입 설명

## 정의

```ts
export type BlockType = "paragraph" | "h1" | "h2" | "h3" | "quote" | "code";
```

## 설명

- 에디터에서 지원하는 블록(문단, 제목, 인용, 코드) 타입을 지정합니다.
