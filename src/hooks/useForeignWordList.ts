/**
 * 외래어 목록 관리 커스텀 훅
 */

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { ForeignWordItem } from "../types/foreignWord";

export function useForeignWordList() {
  const [editor] = useLexicalComposerContext();
  const [items, setItems] = useState<ForeignWordItem[]>([]);
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

      const nextItems: ForeignWordItem[] = nodes.map((el) => ({
        key: el.getAttribute("data-lexical-node-key") || "",
        text: el.textContent || "",
        replacement: el.getAttribute("data-replacement") || "",
        category: el.getAttribute("data-category") || "블로그의 외래어 사용",
        isReplaced: replacedKeys.has(
          el.getAttribute("data-lexical-node-key") || ""
        ),
      }));

      setItems(nextItems);
    };

    const removeListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateListFromDOM();
      });
    });

    updateListFromDOM();

    return () => {
      removeListener();
    };
  }, [editor, replacedKeys]);

  const markAsReplaced = (key: string) => {
    setReplacedKeys((prev) => new Set(prev).add(key));
  };

  return {
    items,
    replacedKeys,
    markAsReplaced,
  };
}
