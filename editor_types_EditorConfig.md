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
