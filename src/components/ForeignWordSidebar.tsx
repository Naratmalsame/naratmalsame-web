import React, { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, TextNode } from "lexical";
import { $isForeignWordNode } from "../shared/nodes/ForeignWordNode";
import styled from "styled-components";

type Item = {
  key: string;
  text: string;
  replacement: string;
  category?: string;
};

type TabType = "refine" | "target" | "score";

const SidebarContainer = styled.aside`
  width: 320px;
  background: #fff;
  border-left: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 14px 16px;
  border: none;
  background: ${(props) => (props.$active ? "#fff" : "transparent")};
  color: ${(props) => (props.$active ? "#212529" : "#6c757d")};
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  cursor: pointer;
  position: relative;
  transition: all 0.2s;

  &:hover {
    color: #212529;
  }

  ${(props) =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #05A569;
    }
  `}
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  margin-left: 6px;
  background: #05a569;
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const WordCard = styled.div<{ $isExpanded: boolean }>`
  background: #fff;
  border: 1px solid ${(props) => (props.$isExpanded ? "#d1d5db" : "#f1f3f5")};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CategoryLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
`;

const CategoryIcon = styled.div`
  width: 18px;
  height: 18px;
  background: #ff6b6b;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  font-weight: bold;
`;

const WordText = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 2px;
`;

const ExpandedContent = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f3f5;
`;

const SuggestionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SuggestionLabel = styled.div`
  font-size: 13px;
  color: #6c757d;
`;

const SuggestionWord = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #05a569;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 8px 16px;
  border: 1px solid ${(props) => (props.$primary ? "#05A569" : "#d1d5db")};
  border-radius: 6px;
  background: ${(props) => (props.$primary ? "#05A569" : "#fff")};
  color: ${(props) => (props.$primary ? "#fff" : "#6c757d")};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$primary ? "#048a57" : "#f9fafb")};
    border-color: ${(props) => (props.$primary ? "#048a57" : "#9ca3af")};
  }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
`;
const DeleteText = styled.span`
  color: #afb1c3;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-decoration-line: line-through;
`;

export default function ForeignWordSidebar(): React.ReactElement {
  const [editor] = useLexicalComposerContext();
  const [items, setItems] = useState<Item[]>([]);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("refine");

  useEffect(() => {
    const updateListFromDOM = () => {
      const root = editor.getRootElement();
      if (!root) {
        setItems([]);
        return;
      }

      const nodes = Array.from(
        root.querySelectorAll<HTMLElement>(".foreign-word-highlight")
      );
      const next: Item[] = nodes.map((el) => ({
        key: el.getAttribute("data-lexical-node-key") || "",
        text: el.textContent || "",
        replacement: el.getAttribute("data-replacement") || "",
        category: el.getAttribute("data-category") || "블로그의 외래어 사용",
      }));

      setItems(next);
      if (expandedKey && !next.find((i) => i.key === expandedKey)) {
        setExpandedKey(null);
      }
    };

    const remove = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateListFromDOM();
      });
    });

    updateListFromDOM();

    return () => {
      remove();
    };
  }, [editor, expandedKey]);

  const handleReplace = (key: string, replacement: string) => {
    editor.update(() => {
      const node = $getNodeByKey(key);
      if (node && $isForeignWordNode(node)) {
        const textNode = new TextNode(replacement);
        node.replace(textNode);
      }
    });
    setExpandedKey(null);
  };

  const handleSkip = () => {
    setExpandedKey(null);
  };

  return (
    <SidebarContainer>
      <TabBar>
        <Tab
          $active={activeTab === "refine"}
          onClick={() => setActiveTab("refine")}
        >
          다듬을 단어
          {items.length > 0 && <Badge>{items.length}</Badge>}
        </Tab>
        {/* <Tab
          $active={activeTab === "target"}
          onClick={() => setActiveTab("target")}
        >
          목표 설정
        </Tab>
        <Tab
          $active={activeTab === "score"}
          onClick={() => setActiveTab("score")}
        >
          종합 점수
          <Badge>40</Badge>
        </Tab> */}
      </TabBar>

      <ContentArea>
        {activeTab === "refine" && (
          <>
            {items.length === 0 ? (
              <EmptyState>검출된 외래어가 없습니다.</EmptyState>
            ) : (
              items.map((item) => (
                <WordCard
                  key={item.key}
                  $isExpanded={expandedKey === item.key}
                  onClick={() =>
                    setExpandedKey((k) => (k === item.key ? null : item.key))
                  }
                >
                  <CardHeader>
                    <CategoryLabel>
                      <CategoryIcon>가</CategoryIcon>
                      {item.category || "블로그의 외래어 사용"}
                    </CategoryLabel>
                    <WordText>{item.text}</WordText>
                  </CardHeader>

                  {expandedKey === item.key && (
                    <ExpandedContent onClick={(e) => e.stopPropagation()}>
                      <SuggestionRow>
                        <SuggestionLabel>나는 이 일을</SuggestionLabel>
                        <SuggestionWord>
                          <DeleteText>{item.text}</DeleteText>{" "}
                          {item.replacement}
                        </SuggestionWord>
                        <SuggestionLabel>수 있어</SuggestionLabel>
                      </SuggestionRow>
                      <ActionButtons>
                        <ActionButton onClick={handleSkip}>
                          거부하기
                        </ActionButton>
                        <ActionButton
                          $primary
                          onClick={() =>
                            handleReplace(item.key, item.replacement)
                          }
                        >
                          다듬기
                        </ActionButton>
                      </ActionButtons>
                    </ExpandedContent>
                  )}
                </WordCard>
              ))
            )}
          </>
        )}

        {activeTab === "target" && (
          <EmptyState>목표 설정 기능은 준비중입니다.</EmptyState>
        )}

        {activeTab === "score" && (
          <EmptyState>종합 점수 기능은 준비중입니다.</EmptyState>
        )}
      </ContentArea>
    </SidebarContainer>
  );
}
