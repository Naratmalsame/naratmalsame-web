/**
 * 에디터 미리보기 관리 커스텀 훅
 */

import { useState, useCallback } from "react";
import type { EditorState } from "lexical";
import { $getRoot } from "lexical";
import { generatePreview, extractUrlFromText } from "../utils/urlUtils";
import type { Preview } from "../types/editor";

export function useEditorPreview() {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [lastDetectedUrl, setLastDetectedUrl] = useState<string | null>(null);

  const handleEditorChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const content = root.getTextContent();
      const url = extractUrlFromText(content);

      if (url) {
        setLastDetectedUrl(url);
        setPreview(generatePreview(url));
      } else {
        setLastDetectedUrl(null);
        setPreview(null);
      }
    });
  }, []);

  return {
    preview,
    lastDetectedUrl,
    handleEditorChange,
  };
}
