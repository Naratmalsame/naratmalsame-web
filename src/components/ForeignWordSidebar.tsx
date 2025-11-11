import React, { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, TextNode } from "lexical";
import { $isForeignWordNode } from "../shared/nodes/ForeignWordNode";
import styled from "styled-components";
import TranslateIcon from "../assets/translate.svg";

type Item = {
  key: string;
  text: string;
  replacement: string;
  category?: string;
  isReplaced?: boolean;
};

type TabType = "refine" | "target" | "score";

const SidebarContainer = styled.aside`
  min-width: 500px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

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
  min-width: 22px;
  width: 22px;
  height: 22px;
  padding: 0;
  margin-left: 6px;
  background: #05a569;
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const WordCard = styled.div<{ $isExpanded: boolean; $isReplaced: boolean }>`
  background: #fff;
  ${(props) => {
    if (props.$isReplaced) return "#D1FAE5";
    if (props.$isExpanded) return "#E5E7EB";
    return "#F3F4F6";
  }};
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #e2e2e2;
  width: 100%;
  padding-bottom: 6px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: stretch;
`;

const CardWordText = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;
const CardLabel = styled.span`
  color: #afb1c3;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const CategoryIcon = styled.div<{ $isReplaced?: boolean }>`
  width: 30px;
  height: 26px;
  border-radius: 100px;
  background-color: #ffdfdf;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WordText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.5;
`;

const ReplacementPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  width: 100%;
`;

const OriginText = styled.span`
  color: black;
  font-weight: 600;
`;

const StrikeText = styled.span`
  color: #afb1c3;
  font-weight: 500;
  text-decoration-line: line-through;
`;

const Arrow = styled.span`
  color: black;
  font-size: 18px;
  font-weight: 600;
`;

const ReplacementText = styled.span`
  color: #10b981;
  font-weight: 800;
`;

const ExpandedContent = styled.div`
  display: flex;
  gap: 12px;
`;

const VerticalLine = styled.div`
  stroke-width: 4px;
  stroke: var(--border-color, #e2e2e2);
  width: 0;
  height: 124px;
  border-left: 4px solid var(--border-color, #e2e2e2);
  border-radius: 4px;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const ExampleSentence = styled.div`
  display: flex;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f8fbfc;
  width: 100%;
  color: black;
  gap: 4px;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const ExampleHighlight = styled.span`
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: 1px solid ${(props) => (props.$primary ? "#10B981" : "#E5E7EB")};
  border-radius: 6px;
  background: ${(props) => (props.$primary ? "#10B981" : "#fff")};
  color: ${(props) => (props.$primary ? "#fff" : "#6B7280")};
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 19.2px; /* 160% */
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$primary ? "#059669" : "#F9FAFB")};
    border-color: ${(props) => (props.$primary ? "#059669" : "#D1D5DB")};
  }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
`;

export default function ForeignWordSidebar(): React.ReactElement {
  const [editor] = useLexicalComposerContext();
  const [items, setItems] = useState<Item[]>([]);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("refine");
  const [replacedKeys, setReplacedKeys] = useState<Set<string>>(new Set());

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
    setReplacedKeys((prev) => new Set(prev).add(key));
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
        <Tab
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
        </Tab>
      </TabBar>

      <ContentArea>
        {activeTab === "refine" && (
          <>
            {items.length === 0 ? (
              <EmptyState>검출된 외래어가 없습니다.</EmptyState>
            ) : (
              items.map((item) => {
                const isReplaced = replacedKeys.has(item.key);
                const isExpanded = expandedKey === item.key;

                return (
                  <WordCard
                    key={item.key}
                    $isExpanded={isExpanded}
                    $isReplaced={isReplaced}
                    onClick={() =>
                      !isReplaced &&
                      setExpandedKey((k) => (k === item.key ? null : item.key))
                    }
                  >
                    {!isExpanded && (
                      <CardHeader>
                        <CategoryIcon $isReplaced={isReplaced}>
                          <img src={TranslateIcon} alt="외래어 아이콘" />
                        </CategoryIcon>
                        <CardWordText>
                          <CardLabel>불필요한 외래어 사용</CardLabel>
                          <WordText>{item.text}</WordText>
                        </CardWordText>
                      </CardHeader>
                    )}

                    {isExpanded && !isReplaced && (
                      <ExpandedContent onClick={(e) => e.stopPropagation()}>
                        <VerticalLine />
                        <ContentWrapper>
                          <CardHeader>
                            <CategoryIcon $isReplaced={isReplaced}>
                              <img src={TranslateIcon} alt="외래어 아이콘" />
                            </CategoryIcon>
                            <CardWordText>
                              <CardLabel>외래어 직역 표현</CardLabel>
                              <ReplacementPreview>
                                <OriginText>{item.text}</OriginText>
                                <Arrow>→</Arrow>
                                <ReplacementText>
                                  {item.replacement}
                                </ReplacementText>
                              </ReplacementPreview>
                            </CardWordText>
                          </CardHeader>
                          <ExampleSentence>
                            나는 이 일을{" "}
                            <ExampleHighlight>
                              <StrikeText>{item.text}</StrikeText>{" "}
                              <ReplacementText>
                                {item.replacement}
                              </ReplacementText>
                            </ExampleHighlight>
                            할 수 있어
                          </ExampleSentence>

                          <ActionButtons>
                            <ActionButton
                              $primary
                              onClick={() =>
                                handleReplace(item.key, item.replacement)
                              }
                            >
                              다듬기
                            </ActionButton>
                            <ActionButton onClick={handleSkip}>
                              거절하기
                            </ActionButton>
                          </ActionButtons>
                        </ContentWrapper>
                      </ExpandedContent>
                    )}
                  </WordCard>
                );
              })
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
