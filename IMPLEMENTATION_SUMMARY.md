# 문장 기반 외래어 탐지 시스템

## 🎯 구현 개요

문장 종결 표현(`.`, `!`, `?`)을 기준으로 텍스트를 분할하고, 각 문장에 고유한 `data-sentence-id` 속성을 부여하여 문장 단위로 외래어를 탐지합니다. **Promise.race**를 활용하여 각 외래어를 서로 다른 시간차를 두고 순차적으로 하이라이트합니다.

## 📁 구현 파일

### 1. 핵심 플러그인

- **`src/plugins/SentenceBasedForeignWordPlugin.tsx`**
  - 문장 단위 분할 및 데이터 유니크 속성 관리
  - Promise.race 기반 비동기 외래어 탐지
  - 시차를 둔 하이라이팅 처리

### 2. 사용 예시 파일

- **`src/components/EditorShellWithSentencePlugin.tsx`**
  - 새 플러그인을 적용한 에디터 셸 컴포넌트
- **`src/AppWithSentencePlugin.tsx`**
  - 데모 및 테스트를 위한 앱 컴포넌트

### 3. 문서

- **`SENTENCE_FOREIGN_WORD_PLUGIN.md`**
  - 상세한 사용 가이드 및 API 문서

## 🚀 주요 기능

### 1. 문장 단위 분할

```typescript
const SENTENCE_TERMINATORS = /[.!?]/;

// "안녕하세요. 커피 마셨어요! 좋아요?"
// → 3개 문장으로 분할
// 각각 고유 ID: sentence-1234-abc, sentence-1235-def, sentence-1236-ghi
```

### 2. 데이터 유니크 속성

```html
<span data-sentence-id="sentence-1701234567890-abc123">안녕하세요</span>
<span
  class="foreign-word-highlight"
  data-sentence-id="sentence-1701234567890-abc123"
  data-replacement="가배"
>
  커피
</span>
```

### 3. Promise.race 비동기 처리

```typescript
// 각 외래어마다 다른 지연 시간
const delay = 500 + index * 300 + Math.random() * 500;

// Promise.race로 가장 빨리 완료되는 것부터 처리
while (pending.length > 0) {
  const fastest = await Promise.race(pending);
  // 하이라이팅 처리
}
```

## 🎬 동작 예시

### 입력

```
오늘 커피를 마셨다. 컴퓨터로 인터넷을 했다!
```

### 처리 타임라인

```
t=0ms    : 문장 분석 시작
t=500ms  : "커피" 하이라이트 (문장 1)
t=800ms  : "컴퓨터" 하이라이트 (문장 2)
t=1100ms : "인터넷" 하이라이트 (문장 2)
```

## 📦 설치 및 사용

### 1. 기존 플러그인 교체

**Before:**

```tsx
import ForeignWordPlugin from "../plugins/ForeignWordPlugin";
<ForeignWordPlugin />;
```

**After:**

```tsx
import SentenceBasedForeignWordPlugin from "../plugins/SentenceBasedForeignWordPlugin";
<SentenceBasedForeignWordPlugin />;
```

### 2. 에디터 설정

```tsx
const editorConfig = {
  namespace: "MyEditor",
  nodes: [
    ForeignWordNode, // 필수!
    // ... 다른 노드들
  ],
  onError: (error: Error) => console.error(error),
};

<LexicalComposer initialConfig={editorConfig}>
  <RichTextPlugin ... />
  <SentenceBasedForeignWordPlugin />
</LexicalComposer>
```

### 3. 데모 실행

```tsx
import AppWithSentencePlugin from "./AppWithSentencePlugin";

// 앱에서 렌더링
<AppWithSentencePlugin />;
```

## ⚙️ 설정 커스터마이징

### 지연 시간 조정

`SentenceBasedForeignWordPlugin.tsx`의 92번째 줄:

```typescript
// 현재: 500ms ~ 2000ms 범위
const delay = 500 + index * 300 + Math.random() * 500;

// 더 빠르게: 200ms ~ 1000ms
const delay = 200 + index * 150 + Math.random() * 300;

// 더 느리게: 1000ms ~ 3000ms
const delay = 1000 + index * 500 + Math.random() * 1000;
```

### 문장 종결 표현 추가

23번째 줄:

```typescript
// 세미콜론(;) 추가
const SENTENCE_TERMINATORS = /[.!?;]/;

// 더 많은 표현 추가
const SENTENCE_TERMINATORS = /[.!?;…]/;
```

## 🔍 핵심 알고리즘

### 1. 문장 분할

```typescript
const splitIntoSentences = (text: string) => {
  const sentences = [];
  let currentStart = 0;

  for (let i = 0; i < text.length; i++) {
    if (SENTENCE_TERMINATORS.test(text[i])) {
      sentences.push({
        text: text.slice(currentStart, i + 1),
        start: currentStart,
        end: i + 1,
      });
      currentStart = i + 1;
    }
  }

  return sentences;
};
```

### 2. 비동기 외래어 탐지

```typescript
const detectForeignWordsWithDelay = async (sentenceText, sentenceId) => {
  const matches = foreignWordTrie.findAllMatches(sentenceText);

  const delayedMatches = matches.map((match, index) => {
    const delay = 500 + index * 300 + Math.random() * 500;
    return new Promise((resolve) => {
      setTimeout(() => resolve(match), delay);
    });
  });

  const results = [];
  const pending = [...delayedMatches];

  while (pending.length > 0) {
    const fastest = await Promise.race(pending);
    results.push(fastest);
    // 완료된 Promise 제거
  }

  return results;
};
```

### 3. 문장 속성 관리

```typescript
// 각 텍스트 노드에 문장 ID 부여
textNodes.forEach((node) => {
  const dom = node.__dom;
  if (dom) {
    dom.setAttribute("data-sentence-id", sentenceId);
  }
});
```

## 🔧 성능 최적화

### 1. Trie 자료구조

- O(n) 시간 복잡도로 외래어 매칭
- 중복 검색 방지

### 2. useCallback 메모이제이션

```typescript
const detectForeignWordsWithDelay = useCallback(async (...) => {
  // ...
}, [foreignWordTrie]);
```

### 3. 타임아웃 관리

```typescript
const processingTimeoutsRef = useRef<Map<string, number>>(new Map());

// cleanup 시 모든 타임아웃 정리
useEffect(() => {
  return () => {
    timeoutsMap.forEach(clearTimeout);
  };
}, []);
```

## 📊 기존 플러그인과 비교

| 항목        | ForeignWordPlugin | SentenceBasedForeignWordPlugin |
| ----------- | ----------------- | ------------------------------ |
| 처리 단위   | 전체 텍스트       | **문장 단위**                  |
| 하이라이팅  | 즉시              | **시차를 두고 순차적**         |
| 데이터 속성 | 없음              | **data-sentence-id**           |
| 비동기 처리 | 없음              | **Promise.race**               |
| 사용자 경험 | 정적              | **동적/시각적**                |

## 🧪 테스트 예제

### 예제 1: 기본 문장

```
입력: "커피를 마셨다."
결과: ~500ms 후 "커피" 하이라이트
```

### 예제 2: 여러 문장

```
입력: "커피를 마셨다. 컴퓨터를 샀다!"
결과:
- 문장 1: ~500ms 후 "커피"
- 문장 2: ~500ms 후 "컴퓨터"
```

### 예제 3: 복잡한 문장

```
입력: "커피를 마시고 컴퓨터로 인터넷을 했다."
결과:
- ~500ms: "커피"
- ~800ms: "컴퓨터"
- ~1300ms: "인터넷"
```

## 🐛 문제 해결

### Q: 외래어가 하이라이트되지 않음

**A:**

1. `ForeignWordNode`가 에디터에 등록되었는지 확인
2. `foreignWordsData`에 해당 단어가 있는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### Q: 지연 시간이 너무 길거나 짧음

**A:** `detectForeignWordsWithDelay` 함수의 delay 계산식 조정

### Q: 메모리 누수 우려

**A:** 플러그인은 cleanup 함수에서 모든 타임아웃을 자동으로 정리합니다

## 📝 TODO

- [ ] 문장 내 외래어 개수 시각화
- [ ] 사용자 정의 지연 시간 설정 UI
- [ ] 문장별 외래어 통계
- [ ] 애니메이션 효과 개선

## 📄 라이선스

이 프로젝트의 라이선스를 따릅니다.

---

**개발:** 2025년 11월  
**버전:** 1.0.0
