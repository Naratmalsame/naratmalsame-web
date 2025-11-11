import styled, { createGlobalStyle } from "styled-components";

export const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
`;

export const AppHeader = styled.header`
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  position: relative;

  .header-logo {
    width: 28px;
    height: 31px;
    position: absolute;
    left: 30px;
    flex-shrink: 0;
  }

  h1 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #212529;
    text-align: center;
  }

  p {
    display: none;
  }
`;

export const EditorLayout = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  background: #f8f8f8;
`;

export const WordItem = styled.div<{ $isSelected?: boolean }>`
  padding: 12px;
  border: 1px solid ${(props) => (props.$isSelected ? "#667eea" : "#e9ecef")};
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) =>
    props.$isSelected ? "rgba(102, 126, 234, 0.04)" : "white"};

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.02);
  }

  .word-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => (props.$isSelected ? "8px" : "0")};
  }

  .word-text {
    font-weight: 600;
    color: #212529;
    font-size: 14px;
  }

  .word-arrow {
    color: #6c757d;
    font-size: 12px;
  }

  .word-replacement {
    color: #667eea;
    font-size: 14px;
    font-weight: 500;
  }

  .word-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e9ecef;
  }

  .action-button {
    flex: 1;
    padding: 6px 12px;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    background: white;
    color: #495057;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #f8f9fa;
      border-color: #adb5bd;
    }

    &.primary {
      background: #05a569;
      color: white;
      border-color: #05a569;

      &:hover {
        background: #048a57;
      }
    }
  }
`;

export const EditorWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
  overflow: hidden;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
`;

export const Toolbar = styled.div`
  display: flex;
  width: 100%;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: nowrap;
  align-items: center;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  .toolbar-section {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  .toolbar-divider {
    width: 1px;
    height: 20px;
    background: #d1d5db;
    margin: 0 6px;
    flex-shrink: 0;
  }

  .toolbar-dropdown {
    min-width: 90px;
    height: 36px;
    padding: 0 12px;
    border: none;
    border-radius: 6px;
    background: white;
    color: #1f2937;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    transition: all 0.15s;
    flex-shrink: 0;

    &:hover {
      background: #f3f4f6;
    }

    &:focus {
      background: #e5e7eb;
    }
  }

  button {
    background: white;
    border: none;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    color: #1f2937;
    font-size: 18px;
    min-width: 36px;
    height: 36px;
    font-weight: 600;
    flex-shrink: 0;

    &:hover {
      background: #f3f4f6;
    }

    &:active {
      background: #e5e7eb;
      transform: scale(0.97);
    }

    &.active {
      background: #dbeafe;
      color: #2563eb;
    }

    strong {
      font-style: normal;
      text-decoration: none;
      font-size: 16px;
      font-weight: 700;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
    }

    em {
      font-style: italic;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 16px;
      font-weight: 600;
    }

    u {
      text-decoration: underline;
      font-size: 16px;
      font-weight: 600;
      font-style: normal;
    }

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
  }
`;

export const EditorContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  position: relative;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;

  .editor-input {
    min-height: 100%;
    max-width: 1200px;
    width: 100%;
    margin: 0;
    margin-top: 60px;
    padding: 48px 80px;
    font-size: 16px;
    line-height: 1.7;
    color: #212529;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
    outline: none;
    background: white;
    flex: 1;
    box-sizing: border-box;

    &:focus {
      outline: none;
    }
  }

  .editor-placeholder {
    position: absolute;
    top: 108px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 1200px;
    width: 100%;
    padding-left: 80px;
    color: #adb5bd;
    pointer-events: none;
    font-size: 16px;
    box-sizing: border-box;
  }

  .editor-paragraph {
    margin: 0 0 16px 0;
    line-height: 1.7;
  }

  .editor-heading-h1 {
    font-size: 2.2em;
    font-weight: 700;
    margin: 32px 0 16px 0;
    color: #212529;
    line-height: 1.3;
  }

  .editor-heading-h2 {
    font-size: 1.75em;
    font-weight: 600;
    margin: 28px 0 14px 0;
    color: #212529;
    line-height: 1.4;
  }

  .editor-heading-h3 {
    font-size: 1.4em;
    font-weight: 600;
    margin: 24px 0 12px 0;
    color: #212529;
    line-height: 1.4;
  }

  .editor-quote {
    margin: 20px 0;
    padding-left: 20px;
    border-left: 3px solid #dee2e6;
    color: #6c757d;
    font-style: italic;
  }

  .editor-code {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 4px;
    font-family: "Courier New", monospace;
    font-size: 14px;
    margin: 16px 0;
    overflow-x: auto;
    border: 1px solid #e9ecef;
  }

  .editor-list-ol,
  .editor-list-ul {
    margin: 12px 0;
    padding-left: 32px;
  }

  .editor-listitem {
    margin: 6px 0;
    line-height: 1.7;
  }

  .editor-link {
    color: #1971c2;
    text-decoration: none;
    border-bottom: 1px solid #1971c2;

    &:hover {
      color: #1864ab;
      border-bottom-color: #1864ab;
    }
  }

  .__origin_word__ {
    color: #c92a2a;
    background: rgba(201, 42, 42, 0.08);
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: 600;
  }

  .__refine_word__ {
    color: #0b7285;
    background: rgba(11, 114, 133, 0.06);
    padding: 2px 4px;
    border-radius: 3px;
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

  .foreign-word-highlight {
    background-color: #fff5f5;
    border-bottom: 2px solid #ff6b6b;
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 3px;
    transition: all 0.2s ease;

    &:hover {
      background-color: #ffe3e3;
      border-bottom-color: #ff4444;
    }
  }
`;

export const RightSidebar = styled.aside`
  width: 280px;
  background: white;
  border-left: 1px solid #e9ecef;
  overflow-y: auto;

  .sidebar-section {
    padding: 16px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #495057;
    margin: 0 0 12px 0;
  }
`;

export const EditorFocusReset = createGlobalStyle`
  * {
    outline: none !important;
  }

  .editor-wrapper *:focus,
  .editor-container *:focus,
  .editor-input:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

export const IframePreview = styled.div`
  padding: 24px;
  border-top: 1px solid #e9ecef;
  background: #f8f8f8;
  display: flex;
  justify-content: center;
  align-items: center;

  iframe {
    width: 100%;
    max-width: 720px;
    height: 405px;
    border: none;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;
