# PreviewType 타입 설명

## 정의

```ts
export type PreviewType = "embed" | "iframe" | "link";
```

## 설명

- 미리보기(Preview) 컴포넌트에서 지원하는 미디어 타입을 지정합니다.
  - `embed`: 임베드 미디어
  - `iframe`: iframe 형태
  - `link`: 일반 링크

---

# Preview 인터페이스 설명

## 정의

```ts
export interface Preview {
  type: PreviewType;
  src: string;
}
```

## 설명

- 미리보기 데이터의 구조를 정의합니다.
  - `type`: 미리보기 타입
  - `src`: 미디어 소스 URL
