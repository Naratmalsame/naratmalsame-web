# 문장 기반 외래어 탐지 플러그인

## 개요

`SentenceBasedForeignWordPlugin`은 텍스트를 문장 단위로 분석하여 외래어를 탐지하고, Promise.race를 활용한 비동기 처리로 각 외래어를 시차를 두고 하이라이트하는 Lexical 에디터 플러그인입니다.

## 주요 기능

### 1. 문장 단위 분할

- 문장 종결 표현 (`.`, `!`, `?`)을 기준으로 텍스트를 문장 단위로 분할
- 각 문장마다 고유한 `data-sentence-id` 속성 부여
- 문장 단위로 외래어 탐지 및 처리

### 2. 비동기 외래어 탐지 (Promise.race)

- 각 외래어마다 다른 지연 시간 적용 (500ms ~ 2000ms 범위)
- Promise.race를 사용하여 가장 빨리 완료되는 외래어부터 순차적으로 처리
- 사용자에게 시각적으로 동적인 하이라이팅 효과 제공

### 3. 데이터 유니크 속성 관리

- 각 문장에 고유 ID 부여: `sentence-{timestamp}-{random}`
- 문장 내 모든 텍스트 노드에 `data-sentence-id` 속성 추가
- 외래어 교체 시에도 속성 유지

## 사용 방법

### 기본 설정

```tsx
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import SentenceBasedForeignWordPlugin from "./plugins/SentenceBasedForeignWordPlugin";
import { ForeignWordNode } from "./shared/nodes/ForeignWordNode";

const editorConfig = {
  namespace: "MyEditor",
  nodes: [ForeignWordNode], // ForeignWordNode 등록 필수!
  onError: (error: Error) => {
    console.error(error);
  },
};

function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>텍스트를 입력하세요...</div>}
        />
        <SentenceBasedForeignWordPlugin />
      </div>
    </LexicalComposer>
  );
}
```

### 기존 ForeignWordPlugin 교체

기존의 `ForeignWordPlugin`을 사용 중이라면 다음과 같이 교체할 수 있습니다:

```tsx
// Before
import ForeignWordPlugin from "./plugins/ForeignWordPlugin";
<ForeignWordPlugin />;

// After
import SentenceBasedForeignWordPlugin from "./plugins/SentenceBasedForeignWordPlugin";
<SentenceBasedForeignWordPlugin />;
```

## 작동 원리

### 1. 문장 분할 프로세스

```
입력 텍스트: "커피를 마셨다. 컴퓨터를 샀다! 스마트폰은 어디?"

↓ 문장 분할

문장 1: "커피를 마셨다." (sentence-1234567890-abc)
문장 2: "컴퓨터를 샀다!" (sentence-1234567891-def)
문장 3: "스마트폰은 어디?" (sentence-1234567892-ghi)
```

### 2. 비동기 외래어 탐지 타임라인

```
문장: "커피를 마시고 컴퓨터로 인터넷을 했다."

t=0ms    : 문장 분석 시작
t=500ms  : "커피" 하이라이트 (첫 번째)
t=800ms  : "컴퓨터" 하이라이트 (두 번째)
t=1300ms : "인터넷" 하이라이트 (세 번째)
```

각 외래어는 다음 공식으로 지연 시간 계산:

```typescript
delay = 500 + index * 300 + Math.random() * 500;
```

### 3. Promise.race 활용

```typescript
// 모든 외래어 탐지 작업을 Promise 배열로 생성
const delayedMatches = matches.map((match, index) => {
  const delay = 500 + index * 300 + Math.random() * 500;
  return new Promise((resolve) => {
    setTimeout(() => resolve(match), delay);
  });
});

// Promise.race로 가장 빨리 완료되는 것부터 처리
while (pending.length > 0) {
  const fastest = await Promise.race(pending);
  results.push(fastest);
  // ... 처리 후 배열에서 제거
}
```

## HTML 구조

### 문장 마크업 예시

```html
<p>
  <span data-sentence-id="sentence-1701234567890-abc123">안녕하세요</span>
  <span
    class="foreign-word-highlight"
    data-sentence-id="sentence-1701234567890-abc123"
    data-replacement="가배"
    data-lexical-node-key="5"
    style="background-color: #ffe6e6; border-bottom: 2px solid #ff4444;"
  >
    커피
  </span>
  <span data-sentence-id="sentence-1701234567890-abc123">를 마셨어요.</span>

  <span data-sentence-id="sentence-1701234567891-def456">오늘은 </span>
  <span
    class="foreign-word-highlight"
    data-sentence-id="sentence-1701234567891-def456"
    data-replacement="전산기"
    data-lexical-node-key="9"
  >
    컴퓨터
  </span>
  <span data-sentence-id="sentence-1701234567891-def456">를 샀습니다!</span>
</p>
```

## 성능 최적화

### 1. Trie 자료구조 사용

- O(n) 시간 복잡도로 텍스트에서 모든 외래어 매칭
- 중복 검색 방지

### 2. useCallback을 통한 메모이제이션

```typescript
const detectForeignWordsWithDelay = useCallback(async (...) => {
  // ...
}, [foreignWordTrie]);

const processSentences = useCallback(async (...) => {
  // ...
}, [editor, detectForeignWordsWithDelay]);
```

### 3. 타임아웃 관리

```typescript
const processingTimeoutsRef = useRef<Map<string, number>>(new Map());

// cleanup 시 모든 타임아웃 정리
useEffect(() => {
  return () => {
    timeoutsMap.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
  };
}, []);
```

## 외래어 클릭 이벤트

외래어를 클릭하면 대체어로 변경할지 확인하는 다이얼로그가 표시됩니다:

```typescript
// 클릭 시 동작
"커피"를 "가배"(으)로 변경하시겠습니까?

[확인] → 텍스트가 "가배"로 교체됨 (ForeignWordNode → TextNode)
[취소] → 변경 없음
```

## 주의사항

1. **ForeignWordNode 필수 등록**: 에디터 설정의 `nodes` 배열에 반드시 `ForeignWordNode`를 포함해야 합니다.

2. **foreignWordsData 수정**: `src/shared/data/foreignWords.ts`에서 외래어 목록을 관리합니다.

3. **지연 시간 조정**: 더 빠르거나 느린 하이라이팅을 원한다면 다음 값을 수정:

   ```typescript
   const delay = 500 + index * 300 + Math.random() * 500;
   //           ↑초기  ↑증가량        ↑랜덤범위
   ```

4. **문장 종결 표현 추가**: 더 많은 종결 표현을 지원하려면:
   ```typescript
   const SENTENCE_TERMINATORS = /[.!?;]/; // ; 추가
   ```

## 기존 플러그인과의 차이점

| 기능        | ForeignWordPlugin | SentenceBasedForeignWordPlugin |
| ----------- | ----------------- | ------------------------------ |
| 처리 단위   | 전체 텍스트       | 문장 단위                      |
| 하이라이팅  | 즉시              | 시차를 두고 순차적             |
| 데이터 속성 | 없음              | data-sentence-id               |
| 비동기 처리 | 없음              | Promise.race 활용              |
| 사용자 경험 | 정적              | 동적/시각적                    |

## 예시

### 입력

```
안녕하세요. 오늘은 커피를 마셨어요! 컴퓨터로 인터넷을 했습니다?
```

### 처리 결과

1. **문장 1**: "안녕하세요." → 외래어 없음
2. **문장 2**: "오늘은 커피를 마셨어요!"
   - ~500ms 후 "커피" 하이라이트
3. **문장 3**: "컴퓨터로 인터넷을 했습니다?"
   - ~500ms 후 "컴퓨터" 하이라이트
   - ~800ms 후 "인터넷" 하이라이트

## 문제 해결

### 외래어가 하이라이트되지 않음

- `ForeignWordNode`가 에디터에 등록되었는지 확인
- `foreignWordsData`에 해당 단어가 있는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 지연 시간이 너무 길거나 짧음

- `detectForeignWordsWithDelay` 함수의 delay 계산식 조정

### 메모리 누수 우려

- 플러그인은 cleanup 함수에서 모든 타임아웃을 자동으로 정리합니다

## 라이선스

이 플러그인은 프로젝트의 라이선스를 따릅니다.
