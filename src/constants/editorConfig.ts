/**
 * Lexical 에디터 초기 설정
 */

import { EDITOR_THEME } from "./editorTheme";
import { EDITOR_NODES } from "./editorNodes";

export const EDITOR_NAMESPACE = "AdvancedEditor";

export const createEditorConfig = () => ({
  namespace: EDITOR_NAMESPACE,
  theme: EDITOR_THEME,
  nodes: EDITOR_NODES,
  onError: (error: unknown) => {
    console.error("[Editor Error]", error);
  },
});
