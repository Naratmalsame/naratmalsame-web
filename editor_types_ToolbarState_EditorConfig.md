# ToolbarState 인터페이스 설명

## 정의

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

## 설명

- 에디터의 도구 모음(툴바) 상태를 나타내는 객체입니다.
  - 각 속성은 해당 서식이 적용 중인지 여부를 나타냅니다.
  - `blockType`: 현재 블록 타입

---

# EditorConfig 인터페이스 설명

## 정의

```ts
export interface EditorConfig {
  namespace: string;
  onError: (error: Error) => void;
}
```

## 설명

- 에디터의 설정 옵션을 정의합니다.
  - `namespace`: Lexical 에디터의 네임스페이스
  - `onError`: 에러 발생 시 호출되는 콜백 함수
