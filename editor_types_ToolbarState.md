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
