import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isTextNode,
  ElementNode,
  TextNode,
} from "lexical";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  $createForeignWordNode,
  $isForeignWordNode,
  ForeignWordNode,
} from "../shared/nodes/ForeignWordNode";
import { foreignWordsData } from "../shared/data/foreignWords";
import { Trie } from "../shared/utils/Trie";

// 문장 종결 표현
const SENTENCE_TERMINATORS = /[.!?]/;

// 외래어 매치 결과
interface ForeignWordMatch {
  word: string;
  replacement: string;
  start: number;
  end: number;
  delay: number;
}

export default function SentenceBasedForeignWordPlugin(): null {
  const [editor] = useLexicalComposerContext();
  const processingTimeoutsRef = useRef<Map<string, number>>(new Map());
  const processingSentencesRef = useRef<Set<string>>(new Set());
  const sentenceDataUniqueMapRef = useRef<Map<string, string>>(new Map());
  const lastTextContentRef = useRef<string>("");
  const typingTimeoutRef = useRef<number | null>(null);
  const userReplacedWordsRef = useRef<Set<string>>(new Set()); // 사용자가 수동으로 변경한 단어 추적

  const foreignWordTrie = useMemo(() => {
    const trie = new Trie();
    foreignWordsData.forEach((fw) => {
      trie.insert(fw.word, fw.replacement);
    });
    return trie;
  }, []);

  // 문장 고유 ID 생성 (data-unique 속성용)
  const generateSentenceId = (): string => {
    return `sentence-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  };

  // 텍스트를 문장 단위로 분할 (종결 표현까지만)
  const splitIntoSentences = (
    text: string
  ): Array<{
    text: string;
    start: number;
    end: number;
    isComplete: boolean;
  }> => {
    const sentences: Array<{
      text: string;
      start: number;
      end: number;
      isComplete: boolean;
    }> = [];
    let currentStart = 0;

    for (let i = 0; i < text.length; i++) {
      if (SENTENCE_TERMINATORS.test(text[i])) {
        const sentenceText = text.slice(currentStart, i + 1);
        sentences.push({
          text: sentenceText,
          start: currentStart,
          end: i + 1,
          isComplete: true, // 종결 표현이 있는 완성된 문장
        });

        // 종결 표현 다음의 공백 문자들을 건너뛰기
        let nextStart = i + 1;
        while (nextStart < text.length && /\s/.test(text[nextStart])) {
          nextStart++;
        }
        currentStart = nextStart;
      }
    }

    // 마지막 문장이 종결 표현 없이 끝나는 경우 (작성 중인 문장도 포함)
    if (currentStart < text.length) {
      const remainingText = text.slice(currentStart);
      // 공백만 있는 경우는 문장으로 처리하지 않음
      if (remainingText.trim().length > 0) {
        sentences.push({
          text: remainingText,
          start: currentStart,
          end: text.length,
          isComplete: false, // 아직 작성 중인 문장
        });
      }
    }

    return sentences;
  };

  // Promise.race를 사용한 비동기 외래어 탐지
  const detectForeignWordsWithDelay = useCallback(
    async (
      sentenceText: string,
      sentenceId: string
    ): Promise<ForeignWordMatch[]> => {
      const matches = foreignWordTrie.findAllMatches(sentenceText);

      if (matches.length === 0) {
        return [];
      }

      // 사용자가 이미 변경한 단어는 제외
      const filteredMatches = matches.filter((match) => {
        const wordKey = `${sentenceId}:${match.word}:${match.start}`;
        return !userReplacedWordsRef.current.has(wordKey);
      });

      if (filteredMatches.length === 0) {
        return [];
      }

      // 각 외래어마다 다른 지연 시간 설정하고 Promise 생성
      const pending = new Set<Promise<{ match: ForeignWordMatch }>>();

      filteredMatches.forEach((match, index) => {
        const delay = 500 + index * 300 + Math.random() * 500;

        const p = new Promise<{ match: ForeignWordMatch }>((resolve) => {
          const timeoutId = window.setTimeout(() => {
            resolve({
              match: {
                ...match,
                delay,
              },
            });
          }, delay);

          // timeout 추적
          processingTimeoutsRef.current.set(
            `${sentenceId}-${index}`,
            timeoutId
          );
        });

        pending.add(p);
      });

      const results: ForeignWordMatch[] = [];

      // Promise.race를 사용하여 완료되는 순서대로 처리
      while (pending.size > 0) {
        const finished = await Promise.race(pending);

        for (const p of pending) {
          p.then((data) => {
            if (data === finished) {
              pending.delete(p);
            }
          });
        }

        results.push(finished.match);
      }

      return results;
    },
    [foreignWordTrie]
  );

  // 문장에 data-unique 속성 추가 및 외래어 처리
  const processSentences = useCallback(
    async (paragraphNode: ElementNode, forceProcess = false) => {
      const fullText = paragraphNode.getTextContent();

      if (!fullText) return;

      const sentences = splitIntoSentences(fullText);

      for (const sentence of sentences) {
        // 문장 고유 키 생성 (텍스트로 고유하게 식별)
        const sentenceKey = sentence.text.trim();

        if (!sentenceKey) continue;

        // 이미 이 텍스트로 처리된 적이 있는지 확인
        let sentenceId = sentenceDataUniqueMapRef.current.get(sentenceKey);

        // 새로운 문장인 경우 새 ID 생성
        if (!sentenceId) {
          sentenceId = generateSentenceId();
          sentenceDataUniqueMapRef.current.set(sentenceKey, sentenceId);
        }

        // 이미 처리 중인 문장은 건너뛰기 (단, forceProcess가 true면 재처리)
        if (processingSentencesRef.current.has(sentenceKey) && !forceProcess) {
          continue;
        }

        // 완성된 문장이거나 forceProcess가 true인 경우만 처리
        if (!sentence.isComplete && !forceProcess) {
          continue;
        }

        processingSentencesRef.current.add(sentenceKey);

        // 문장 범위 내의 텍스트 노드들 찾기 (재귀적으로 순회하며 offset 추적)
        const textNodesInSentence: Array<{
          node: TextNode;
          nodeStart: number;
          nodeEnd: number;
        }> = [];

        const collectTextNodesRecursive = (
          node: ElementNode | TextNode,
          offsetAccumulator: { value: number }
        ) => {
          if ($isTextNode(node)) {
            const nodeText = node.getTextContent();
            const nodeStart = offsetAccumulator.value;
            const nodeEnd = nodeStart + nodeText.length;

            // 이 노드가 현재 문장 범위와 겹치는지 확인
            if (nodeEnd > sentence.start && nodeStart < sentence.end) {
              textNodesInSentence.push({
                node,
                nodeStart,
                nodeEnd,
              });
            }

            offsetAccumulator.value = nodeEnd;
          } else if ($isElementNode(node)) {
            const children = node.getChildren();
            children.forEach((child) => {
              if ($isTextNode(child) || $isElementNode(child)) {
                collectTextNodesRecursive(child, offsetAccumulator);
              }
            });
          }
        };

        collectTextNodesRecursive(paragraphNode, { value: 0 });

        // 각 텍스트 노드에 data-unique 속성 추가
        textNodesInSentence.forEach(({ node }) => {
          const dom = (node as TextNode & { __dom?: HTMLElement }).__dom;
          if (dom) {
            dom.setAttribute("data-unique", sentenceId);
          }
        });

        console.log(
          `[문장 처리 시작] data-unique="${sentenceId}", 텍스트: "${sentence.text.trim()}", 범위: [${
            sentence.start
          }, ${sentence.end}), 완성여부: ${sentence.isComplete}, 노드 수: ${
            textNodesInSentence.length
          }`
        );
        textNodesInSentence.forEach(({ node, nodeStart, nodeEnd }, idx) => {
          console.log(
            `  노드 ${idx}: [${nodeStart}, ${nodeEnd}) = "${node.getTextContent()}"`
          );
        });

        // 비동기로 외래어 탐지 및 처리
        detectForeignWordsWithDelay(sentence.text, sentenceId)
          .then((matches) => {
            editor.update(() => {
              // 현재 커서 위치 저장
              const selection = $getSelection();
              let cursorOffset: number | null = null;
              let cursorNodeKey: string | null = null;

              if ($isRangeSelection(selection)) {
                const anchorNode = selection.anchor.getNode();
                cursorNodeKey = anchorNode.getKey();
                cursorOffset = selection.anchor.offset;
              }

              matches.forEach((match) => {
                // 문장 시작 기준으로 절대적 위치 계산
                const absoluteStart = sentence.start + match.start;
                const absoluteEnd = sentence.start + match.end;

                // 해당 범위에 속하는 노드 찾기
                for (const {
                  node,
                  nodeStart,
                  nodeEnd,
                } of textNodesInSentence) {
                  // 매치가 이 노드 범위 내에 있는지 확인
                  if (absoluteStart >= nodeStart && absoluteStart < nodeEnd) {
                    // 노드가 아직 유효한지 확인
                    try {
                      const nodeText = node.getTextContent();

                      if ($isForeignWordNode(node)) {
                        continue;
                      }

                      // 현재 커서가 이 노드에 있는지 확인
                      const isNodeWithCursor = cursorNodeKey === node.getKey();

                      const relativeStart = absoluteStart - nodeStart;
                      const relativeEnd = Math.min(
                        absoluteEnd - nodeStart,
                        nodeText.length
                      );

                      // 노드 분할 및 교체
                      let targetNode: TextNode = node;
                      let beforeNode: TextNode | null = null;
                      let afterNode: TextNode | null = null;

                      // 시작 부분 분할
                      if (relativeStart > 0) {
                        const [before, after] =
                          targetNode.splitText(relativeStart);
                        beforeNode = before as TextNode;
                        targetNode = after as TextNode;
                      }

                      // 끝 부분 분할
                      const targetText = targetNode.getTextContent();
                      const matchLength = relativeEnd - relativeStart;

                      if (matchLength < targetText.length) {
                        const [matchPart, remaining] =
                          targetNode.splitText(matchLength);
                        targetNode = matchPart as TextNode;
                        afterNode = remaining as TextNode;
                      }

                      // TextNode를 ForeignWordNode로 교체
                      const foreignWordNode = $createForeignWordNode(
                        match.word,
                        match.replacement
                      );

                      // data-unique 유지
                      const dom = (
                        targetNode as TextNode & { __dom?: HTMLElement }
                      ).__dom;
                      if (dom) {
                        const dataUniqueAttr = dom.getAttribute("data-unique");
                        targetNode.replace(foreignWordNode);

                        const newDom = (
                          foreignWordNode as ForeignWordNode & {
                            __dom?: HTMLElement;
                          }
                        ).__dom;
                        if (newDom && dataUniqueAttr) {
                          newDom.setAttribute("data-unique", dataUniqueAttr);
                        }
                      } else {
                        targetNode.replace(foreignWordNode);
                      }

                      // 커서 위치 복원
                      if (isNodeWithCursor && cursorOffset !== null) {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                          // 커서가 교체된 노드 앞에 있었으면 beforeNode로
                          if (cursorOffset <= relativeStart && beforeNode) {
                            beforeNode.select(cursorOffset, cursorOffset);
                          }
                          // 커서가 교체된 노드 뒤에 있었으면 afterNode로
                          else if (cursorOffset >= relativeEnd && afterNode) {
                            const newOffset = cursorOffset - relativeEnd;
                            afterNode.select(newOffset, newOffset);
                          }
                          // 커서가 교체된 노드 안에 있었으면 afterNode의 시작으로
                          else if (afterNode) {
                            afterNode.select(0, 0);
                          } else if (beforeNode) {
                            const beforeText = beforeNode.getTextContent();
                            beforeNode.select(
                              beforeText.length,
                              beforeText.length
                            );
                          }
                        }
                      }

                      break;
                    } catch (error) {
                      // 노드가 이미 제거되었을 수 있음
                      console.warn("Node processing error:", error);
                      break;
                    }
                  }
                }
              });
            });
          })
          .finally(() => {
            // 처리 완료 후 Set에서 제거
            processingSentencesRef.current.delete(sentenceKey);
          });
      }
    },
    [editor, detectForeignWordsWithDelay]
  );

  useEffect(() => {
    if (!editor.hasNodes([ForeignWordNode])) {
      throw new Error(
        "SentenceBasedForeignWordPlugin: ForeignWordNode not registered on editor"
      );
    }

    const timeoutsMap = processingTimeoutsRef.current;

    // 종결 표현이 입력되었는지 감지하는 함수
    const checkForSentenceEnding = (text: string): boolean => {
      return SENTENCE_TERMINATORS.test(text[text.length - 1]);
    };

    // 에디터 변경 감지
    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot();
          const currentText = root.getTextContent();

          // 종결 표현이 입력된 경우 즉시 처리
          if (
            checkForSentenceEnding(currentText) &&
            currentText !== lastTextContentRef.current
          ) {
            console.log("[종결 표현 감지] 즉시 외래어 처리 시작");

            // 기존 타이머 취소
            if (typingTimeoutRef.current !== null) {
              clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = null;
            }

            // 즉시 처리
            const children = root.getChildren();
            children.forEach((child) => {
              if ($isElementNode(child)) {
                processSentences(child, true); // forceProcess = true
              }
            });

            lastTextContentRef.current = currentText;
            return;
          }

          // 기존 타이머 취소
          if (typingTimeoutRef.current !== null) {
            clearTimeout(typingTimeoutRef.current);
          }

          // 2초 타이머 시작 (미완성 문장 처리)
          typingTimeoutRef.current = window.setTimeout(() => {
            console.log("[2초 타이머] 미완성 문장 외래어 처리 시작");

            editorState.read(() => {
              const root = $getRoot();
              const children = root.getChildren();

              children.forEach((child) => {
                if ($isElementNode(child)) {
                  processSentences(child, true); // forceProcess = true
                }
              });
            });

            lastTextContentRef.current = currentText;
          }, 2000);
        });
      }
    );

    return () => {
      removeUpdateListener();

      if (typingTimeoutRef.current !== null) {
        clearTimeout(typingTimeoutRef.current);
      }

      // 모든 타임아웃 정리
      timeoutsMap.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeoutsMap.clear();
    };
  }, [editor, foreignWordTrie, processSentences]);

  // 외래어 클릭 이벤트 처리
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("foreign-word-highlight")) {
        const replacement = target.getAttribute("data-replacement");
        const originalText = target.textContent;
        const nodeKey = target.getAttribute("data-lexical-node-key");
        const dataUnique = target.getAttribute("data-unique");

        if (replacement && originalText && nodeKey) {
          const confirmChange = window.confirm(
            `"${originalText}"를 "${replacement}"(으)로 변경하시겠습니까?`
          );

          if (confirmChange) {
            editor.update(() => {
              const node = $getNodeByKey(nodeKey);
              if (node && $isForeignWordNode(node)) {
                const textNode = new TextNode(replacement);
                node.replace(textNode);

                // 사용자가 변경한 단어 추적 (재하이라이팅 방지)
                if (dataUnique && originalText) {
                  // 문장 내에서 해당 단어의 위치를 찾아 추적
                  editor.getEditorState().read(() => {
                    const root = $getRoot();
                    const fullText = root.getTextContent();
                    const sentences = fullText.split(/[.!?]/);

                    sentences.forEach((sentence) => {
                      const sentenceId = dataUnique;
                      const wordIndex = sentence.indexOf(originalText);
                      if (wordIndex !== -1) {
                        const wordKey = `${sentenceId}:${originalText}:${wordIndex}`;
                        userReplacedWordsRef.current.add(wordKey);
                        console.log(`[사용자 변경 추적] ${wordKey}`);
                      }
                    });
                  });

                  // data-unique 유지
                  const dom = (textNode as TextNode & { __dom?: HTMLElement })
                    .__dom;
                  if (dom) {
                    dom.setAttribute("data-unique", dataUnique);
                  }
                }
              }
            });
          }
        }
      }
    };

    const editorElement = editor.getRootElement();
    if (editorElement) {
      editorElement.addEventListener("click", handleClick);
      return () => {
        editorElement.removeEventListener("click", handleClick);
      };
    }
  }, [editor]);

  return null;
}
