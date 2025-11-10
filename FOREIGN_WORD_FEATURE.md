# 외래어 하이라이팅 기능 가이드

## 개요

Lexical Editor를 사용하여 문서 작성 시 외래어를 자동으로 감지하고 하이라이팅하는 기능을 구현했습니다.

## 구현된 기능

### 1. **외래어 자동 감지 및 하이라이팅** ✅

- 문서에 텍스트를 입력하면 실시간으로 외래어를 감지합니다
- 감지된 외래어는 노란색 배경과 주황색 밑줄로 하이라이팅됩니다
- 마우스를 올리면 툴팁으로 대체어를 미리 확인할 수 있습니다

### 2. **위치 변경 시 하이라이팅 유지** ✅

- 하이라이팅된 외래어를 복사/붙여넣기하거나 이동해도 하이라이팅이 유지됩니다
- Lexical의 커스텀 노드를 사용하여 노드 자체에 속성을 저장하므로 위치 이동에도 안정적입니다

### 3. **외래어 변경 기능** ✅

- 하이라이팅된 외래어를 클릭하면 확인 대화상자가 나타납니다
- 확인을 누르면 해당 외래어가 대체어로 자동 변경됩니다
- 예: "커피" → "가배", "컴퓨터" → "전산기"

### 4. **하이라이팅된 문자 삭제** ✅

- Backspace 또는 Delete 키로 하이라이팅된 외래어를 삭제할 수 있습니다
- 선택 후 삭제하면 외래어 노드가 완전히 제거됩니다

## 파일 구조

```
src/
├── shared/
│   ├── data/
│   │   └── foreignWords.ts          # 외래어 목데이터 및 헬퍼 함수
│   └── nodes/
│       └── ForeignWordNode.ts       # 외래어 커스텀 노드
├── plugins/
│   └── ForeignWordPlugin.tsx        # 외래어 감지 및 처리 플러그인
├── components/
│   └── EditorShell.tsx              # 플러그인 적용
└── App.tsx                          # 노드 등록
```

## 사용된 기술

### 1. **ForeignWordNode (커스텀 노드)**

```typescript
// TextNode를 확장하여 외래어 전용 노드 생성
class ForeignWordNode extends TextNode {
  __replacement: string; // 대체어 저장

  // DOM 렌더링 시 하이라이팅 스타일 적용
  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.style.backgroundColor = "#fff3cd";
    element.style.borderBottom = "2px solid #ffc107";
    // ...
  }
}
```

### 2. **ForeignWordPlugin**

```typescript
// TextNode Transform을 사용한 자동 감지
editor.registerNodeTransform(TextNode, (textNode) => {
  const text = textNode.getTextContent();
  const foreignWordMatch = isForeignWord(text);

  if (foreignWordMatch) {
    // TextNode를 ForeignWordNode로 변환
    const foreignWordNode = $createForeignWordNode(
      text,
      foreignWordMatch.replacement
    );
    textNode.replace(foreignWordNode);
  }
});
```

### 3. **외래어 데이터 관리**

```typescript
// foreignWords.ts
export const foreignWordsData: ForeignWord[] = [
  { word: "커피", replacement: "가배" },
  { word: "컴퓨터", replacement: "전산기" },
  { word: "스마트폰", replacement: "똑똑누리손전화기" },
  // ... 30개의 외래어 목데이터
];
```

## 테스트 방법

1. 개발 서버 실행:

```bash
pnpm dev
```

2. 브라우저에서 `http://localhost:5173` 접속

3. 다음 단어들을 입력해보세요:
   - **커피** → 가배
   - **컴퓨터** → 전산기
   - **스마트폰** → 똑똑누리손전화기
   - **인터넷** → 누리망
   - **마우스** → 쥐
   - **키보드** → 자판
4. 기능 테스트:
   - ✅ 입력하면 즉시 하이라이팅
   - ✅ 하이라이팅된 단어 클릭 → 변경 확인
   - ✅ 단어를 다른 위치로 이동 → 하이라이팅 유지
   - ✅ Backspace/Delete로 삭제

## 주요 특징

### 실시간 감지

- `registerNodeTransform`을 사용하여 텍스트 입력 즉시 외래어 감지
- 성능 최적화를 위해 이미 변환된 ForeignWordNode는 재처리하지 않음

### 안정적인 위치 추적

- Lexical의 노드 시스템을 활용하여 위치 변경, 복사/붙여넣기에도 안정적
- DOM 요소가 아닌 노드 자체에 데이터 저장

### 사용자 친화적 UI

- 하이라이팅으로 시각적 피드백
- 클릭 한 번으로 간편한 변경
- 툴팁으로 대체어 미리보기

### 확장 가능성

- `foreignWords.ts`에 단어만 추가하면 자동으로 적용
- 카테고리별 분류, 사용자 정의 단어 등 확장 가능

## 추가 개선 가능 사항

1. **일괄 변경 기능**: 문서 내 모든 외래어를 한 번에 변경
2. **외래어 사전 관리 UI**: 외래어 추가/삭제/수정 인터페이스
3. **설정 옵션**: 하이라이팅 색상, 자동 변경 여부 등 사용자 설정
4. **통계**: 문서 내 외래어 사용 빈도 분석
5. **제안 시스템**: 여러 대체어 중 선택할 수 있는 UI
