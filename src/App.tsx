import { useState, useCallback } from "react";
import type { EditorState } from "lexical";
import { $getRoot } from "lexical";
import EditorShell from "./components/EditorShell";
import PreviewComponent from "./components/Preview";
import * as S from "./styles/AppStyles";
import LogoImage from "./assets/logo.svg";
import { createEditorInitialConfig } from "./constants/editorInitialConfig";
import { generatePreview, extractUrlFromText } from "./utils/urlUtils";
import type { Preview } from "./types/editor";

/**
 * メインアプリケーションコンポーネント
 * Lexicalエディタを使用した文書編集アプリケーション
 */
export default function App() {
  const initialConfig = createEditorInitialConfig();

  const [preview, setPreview] = useState<Preview | null>(null);
  const [lastDetectedUrl, setLastDetectedUrl] = useState<string | null>(null);

  /**
   * エディタの状態変更を処理します
   */
  const handleEditorChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const content = root.getTextContent();
      const detectedUrl = extractUrlFromText(content);

      if (detectedUrl) {
        setLastDetectedUrl(detectedUrl);
        setPreview(generatePreview(detectedUrl));
      } else {
        setLastDetectedUrl(null);
        setPreview(null);
      }
    });
  }, []);

  return (
    <S.AppContainer>
      {/* グローバルフォーカスリセット */}
      <S.EditorFocusReset />

      {/* ヘッダー */}
      <S.AppHeader>
        <img src={LogoImage} alt="나랏말싸미 로고" className="header-logo" />
        <h1>나랏말싸미 - 인공지능의 발전과 사회적 영향</h1>
        <p>Lexical Editor 문서 작성</p>
      </S.AppHeader>

      {/* エディタレイアウト */}
      <S.EditorLayout>
        <S.EditorWrapper>
          <EditorShell
            initialConfig={initialConfig}
            onChange={handleEditorChange}
          />
          <PreviewComponent
            preview={preview}
            lastDetectedUrl={lastDetectedUrl}
          />
        </S.EditorWrapper>
      </S.EditorLayout>
    </S.AppContainer>
  );
}
