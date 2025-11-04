import styled, { createGlobalStyle } from "styled-components";

/**
 * App 전반 레이아웃 및 에디터 관련 스타일을 styled-components로 옮겼습니다.
 * 기존 클래스 네임(.toolbar, .toolbar-section 등)을 그대로 남겨
 * 기존 컴포넌트(예: src/components/AdvancedToolbar.tsx)와 호환됩니다.
 */

export const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: black;
  padding: 20px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
`;

export const AppHeader = styled.header`
  text-align: center;
  color: white;
  margin-bottom: 20px;

  h1 {
    margin: 0 0 10px 0;
    font-size: 2.5em;
    font-weight: 700;
  }

  p {
    margin: 0;
    opacity: 0.9;
    font-size: 1.1em;
  }
`;

/* 에디터 래퍼 (기존 .editor-wrapper 대체) */
export const EditorWrapper = styled.div`
  max-width: 1200px;
  min-height: 1200px;
  margin: 0 auto;
  background: white;
  color: #212529;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  /* 기존 .toolbar 관련 클래스는 AdvancedToolbar에서 사용하므로 하위 선택자로 유지 */
  .toolbar {
    display: flex;
    gap: 4px;
    padding: 12px;
    background: #f8f9fa;
    border-bottom: 2px solid #e9ecef;
    flex-wrap: wrap;
    align-items: center;
  }

  .toolbar-section {
    display: flex;
    gap: 4px;
  }

  .toolbar-divider {
    width: 1px;
    height: 24px;
    background: #dee2e6;
    margin: 0 8px;
  }

  .toolbar button {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    color: #495057;
  }

  .toolbar button:hover {
    background: #e9ecef;
    border-color: #adb5bd;
    transform: translateY(-1px);
  }

  .toolbar button:active {
    transform: translateY(0);
  }

  .toolbar button.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
`;

/* 에디터 컨테이너(기존 .editor-container) */
export const EditorContainer = styled.div`
  position: relative;
  background: white;
  /* 에디터 내부 텍스트가 흰색으로 표시되어 보이지 않는 문제를 방지하기 위한 기본 색상 지정 */
  color: #212529;
  /* 초기 에디터 높이를 늘려 채팅/글 작성 영역을 더 크게 보이게 함 */
  min-height: 700px;

  /* 문서(document) 느낌 스타일: 중앙폭 고정, serif 계열 폰트, 넉넉한 여백 */
  .editor-input {
    /* 에디터 입력(채팅 쓰는 영역) 초기 높이 증가 */
    min-height: 700px;
    max-width: 760px; /* 용지 폭 */
    margin: 0 auto; /* 중앙 정렬 */
    padding: 48px 56px; /* 문서 여백 */
    font-size: 17px;
    line-height: 1.9;
    color: #111827; /* 문서 텍스트 색상 */
    font-family: Georgia, "Times New Roman", Times, serif; /* 문서 느낌의 serif 폰트 */
    background: transparent; /* 배경은 wrapper의 종이 느낌으로 유지 */
    outline: none; /* 기본 포커스 테두리 제거 */
    -webkit-tap-highlight-color: transparent;
    -webkit-user-modify: read-write-plaintext-only;
  }

  /* 포커스 시 브라우저의 기본 블루 포커스/outline, box-shadow 등을 완전히 제거하여 파란 테두리 제거 */
  /* 넓은 범위(입력 요소 및 래퍼)에 포커스 스타일 제거: 일부 브라우저는 wrapper나 contentEditable 요소에 포커스 링을 그림 */
  .editor-input:focus,
  .editor-input:focus-visible,
  .editor-input[contenteditable="true"]:focus,
  #lexical-editor:focus,
  .editor-container:focus,
  .editor-wrapper:focus {
    outline: none !important;
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
    border-color: transparent !important;
  }

  /* 포커스가 래퍼 내부 어디에 있든지 파란 테두리(포커스 링)를 완전 제거합니다. */
  .editor-wrapper:focus-within,
  .editor-container:focus-within,
  .editor-wrapper:focus,
  .editor-container:focus,
  .editor-wrapper *:focus,
  .editor-container *:focus,
  #lexical-editor:focus,
  .editor-input[contenteditable="true"]:focus {
    outline: 0 !important;
    outline-color: transparent !important;
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
    border-color: transparent !important;
  }

  /* 선택 영역 색상(문서 느낌) */
  .editor-input ::selection {
    background: rgba(102, 126, 234, 0.12);
  }

  .editor-placeholder {
    position: absolute;
    top: 24px;
    left: 24px;
    color: #adb5bd;
    pointer-events: none;
    font-size: 16px;
  }

  .editor-paragraph {
    margin: 0 0 12px 0;
  }

  .editor-heading-h1 {
    font-size: 2em;
    font-weight: 700;
    margin: 24px 0 16px 0;
    color: #212529;
  }

  .editor-heading-h2 {
    font-size: 1.5em;
    font-weight: 600;
    margin: 20px 0 12px 0;
    color: #212529;
  }

  .editor-heading-h3 {
    font-size: 1.25em;
    font-weight: 600;
    margin: 16px 0 12px 0;
    color: #212529;
  }

  .editor-quote {
    margin: 16px 0;
    padding-left: 16px;
    border-left: 4px solid #667eea;
    color: #495057;
    font-style: italic;
  }

  .editor-code {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 6px;
    font-family: "Courier New", monospace;
    font-size: 14px;
    margin: 16px 0;
    overflow-x: auto;
  }

  .editor-list-ol,
  .editor-list-ul {
    margin: 12px 0;
    padding-left: 32px;
  }

  .editor-listitem {
    margin: 4px 0;
  }

  .editor-checklist {
    list-style: none;
    padding-left: 24px;
  }

  .editor-link {
    color: #667eea;
    text-decoration: none;
    border-bottom: 1px solid #667eea;
  }

  .editor-link:hover {
    color: #764ba2;
    border-bottom-color: #764ba2;
  }

  /* 외래어(원문) 하이라이트 */
  .__origin_word__ {
    color: #c92a2a; /* 텍스트 빨간색 */
    background: rgba(201, 42, 42, 0.06); /* 약한 배경 하이라이트 */
    padding: 0 4px;
    border-radius: 4px;
    font-weight: 600;
  }

  /* 교정(Refined) 단어 하이라이트 (대비 색상) */
  .__refine_word__ {
    color: #0b7285; /* 청록 계열 */
    background: rgba(11, 114, 133, 0.04);
    padding: 0 4px;
    border-radius: 4px;
    font-weight: 600;
  }

  .editor-text-bold {
    font-weight: 700;
  }

  .editor-text-italic {
    font-style: italic;
  }

  .editor-text-underline {
    text-decoration: underline;
  }

  .editor-text-strikethrough {
    text-decoration: line-through;
  }

  .editor-text-code {
    background: #f8f9fa;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: "Courier New", monospace;
    font-size: 0.9em;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
  }

  table td,
  table th {
    border: 1px solid #dee2e6;
    padding: 8px 12px;
    text-align: left;
  }

  table th {
    background: #f8f9fa;
    font-weight: 600;
  }

  hr {
    border: none;
    border-top: 2px solid #e9ecef;
    margin: 24px 0;
  }

  /* 에디터 내부에 렌더링되는 iframe 프리뷰 스타일 */
  .iframe-preview {
    padding: 12px 16px;
    border-top: 1px solid #e9ecef;
    background: #fafbfd;
    display: block;
    margin: 12px auto 0 auto;
    width: 100%;
    box-sizing: border-box;
    border-radius: 8px;
  }

  .iframe-preview iframe {
    width: 100%;
    max-width: 960px;
    height: 360px;
    border: none;
    border-radius: 8px;
    display: block;
    margin: 0 auto;
  }
`;

/* 프리뷰 영역 */
export const IframePreview = styled.div`
  padding: 16px 24px 32px 24px;
  border-top: 1px solid #e9ecef;
  background: #fafbfd;
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  align-items: center;

  iframe {
    width: 100%;
    min-width: 960px;
    height: 360px;
    border: none;
    border-radius: 8px;
    display: block;
    margin: 0 auto;
  }
`;

/*
  전역 포커스 리셋: 브라우저가 강제로 그리는 파란 포커스 링을 제거합니다.
  주의: 접근성(키보드 네비게이션) 영향을 줄 수 있으므로 대체 시각 표시를 권장합니다.
*/
export const EditorFocusReset = createGlobalStyle`
  /* 타겟을 에디터 래퍼로 한정하여 전역 영향 최소화 */
  .editor-wrapper :is(*, *::before, *::after):focus,
  .editor-wrapper :is(*, *::before, *::after):focus-visible,
  .editor-wrapper :is(*, *::before, *::after):focus-within {
    outline: none !important;
    outline-color: transparent !important;
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
    border-color: transparent !important;
  }

  /* 추가 안전망: id로 직접 참조되는 경우도 덮어쓰기 */
  #lexical-editor:focus,
  #lexical-editor:focus-visible,
  #lexical-editor:focus-within {
    outline: none !important;
    box-shadow: none !important;
  }
`;
