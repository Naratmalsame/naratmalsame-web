import { type FC, memo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import type { EditorState } from "lexical";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import ToolbarNew from "../ToolbarNew";
import AutoLinkPlugin from "./AutoLinkPlugin";
import SentenceBasedForeignWordPlugin from "../plugins/SentenceBasedForeignWordPlugin";
import { ForeignWordTooltipPlugin } from "../plugins/ForeignWordTooltipPlugin";
import ForeignWordSidebar from "./ForeignWordSidebar";
import MenuBar from "./MenuBar";
import * as S from "../styles/AppStyles";

// ============================================================================
// Types
// ============================================================================

interface EditorShellProps {
  initialConfig: InitialConfigType;
  onChange: (editorState: EditorState) => void;
  onMenuAction?: (action: string) => void;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Lexical エディタシェル
 * メニューバー、ツールバー、プラグインを統合した完全なエディタ
 */
const EditorShell: FC<EditorShellProps> = memo(
  ({ initialConfig, onChange, onMenuAction }) => {
    return (
      <LexicalComposer initialConfig={initialConfig}>
        {/* メニューバー */}
        <MenuBar onMenuAction={onMenuAction} />

        {/* ツールバー */}
        <S.Toolbar>
          <ToolbarNew />
        </S.Toolbar>

        {/* メインエディタレイアウト */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* エディタコンテナ */}
          <S.EditorContainer>
            {/* リッチテキストプラグイン */}
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input" id="lexical-editor" />
              }
              placeholder={
                <div className="editor-placeholder">내용을 입력하세요...</div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            {/* 状態変更ハンドラー */}
            <OnChangePlugin onChange={onChange} />

            {/* 標準プラグイン */}
            <HistoryPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <AutoLinkPlugin />
            <TablePlugin />
            <HorizontalRulePlugin />
            <TabIndentationPlugin />

            {/* カスタムプラグイン */}
            <SentenceBasedForeignWordPlugin />
            <ForeignWordTooltipPlugin />
          </S.EditorContainer>

          {/* サイドバー */}
          <ForeignWordSidebar />
        </div>
      </LexicalComposer>
    );
  },
);

EditorShell.displayName = "EditorShell";

export default EditorShell;
