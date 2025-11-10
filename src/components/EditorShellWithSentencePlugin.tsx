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
import AdvancedToolbar from "./AdvancedToolbar";
import AutoLinkPlugin from "./AutoLinkPlugin";
// 기존 플러그인 대신 새로운 문장 기반 플러그인 사용
import SentenceBasedForeignWordPlugin from "../plugins/SentenceBasedForeignWordPlugin";
import ForeignWordSidebar from "./ForeignWordSidebar";
import type { EditorState } from "lexical";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";

export default function EditorShellWithSentencePlugin({
  initialConfig,
  onChange,
}: {
  initialConfig: InitialConfigType;
  onChange: (editorState: EditorState) => void;
}): React.ReactElement {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-wrapper">
        <AdvancedToolbar />
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input" id="lexical-editor" />
            }
            placeholder={
              <div className="editor-placeholder">
                문장을 입력해보세요. 외래어가 시차를 두고 하이라이트됩니다...
              </div>
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
          {/* 
            ForeignWordPlugin 대신 SentenceBasedForeignWordPlugin 사용
            - 문장 단위로 외래어 탐지
            - Promise.race를 활용한 비동기 시차 하이라이팅
            - data-sentence-id 속성으로 문장 단위 관리
          */}
          <SentenceBasedForeignWordPlugin />
        </div>
        {/* 오른쪽 사이드바: 외래어 목록 및 교체 UI */}
        <ForeignWordSidebar />
      </div>
    </LexicalComposer>
  );
}
