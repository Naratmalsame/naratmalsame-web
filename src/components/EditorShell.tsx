import React from "react";
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
import ToolbarNew from "../ToolbarNew";
import AutoLinkPlugin from "./AutoLinkPlugin";
import SentenceBasedForeignWordPlugin from "../plugins/SentenceBasedForeignWordPlugin";
import { ForeignWordTooltipPlugin } from "../plugins/ForeignWordTooltipPlugin";
import ForeignWordSidebar from "./ForeignWordSidebar";
import MenuBar from "./MenuBar";
import * as S from "../styles/AppStyles";

import type { EditorState } from "lexical";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";

export default function EditorShell({
  initialConfig,
  onChange,
}: {
  initialConfig: InitialConfigType;
  onChange: (editorState: EditorState) => void;
}): React.ReactElement {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <MenuBar />
      <S.Toolbar>
        <ToolbarNew />
      </S.Toolbar>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <S.EditorContainer>
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input" id="lexical-editor" />
            }
            placeholder={
              <div className="editor-placeholder">내용을 입력하세요...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <AutoLinkPlugin />
          <TablePlugin />
          <HorizontalRulePlugin />
          <TabIndentationPlugin />
          <SentenceBasedForeignWordPlugin />
          <ForeignWordTooltipPlugin />
        </S.EditorContainer>
        <ForeignWordSidebar />
      </div>
    </LexicalComposer>
  );
}
