import React, { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, TextNode } from "lexical";
import { $isForeignWordNode } from "../shared/nodes/ForeignWordNode";

type Item = {
  key: string;
  text: string;
  replacement: string;
};

export default function ForeignWordSidebar(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    // 스냅샷 기반으로 DOM에서 foreign-word-highlight 요소를 읽어 목록을 갱신
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
      }));

      setItems(next);
      // 선택된 키가 더이상 없으면 선택 해제
      if (selectedKey && !next.find((i) => i.key === selectedKey)) {
        setSelectedKey(null);
      }
    };

    // 에디터 업데이트 리스너 등록
    const remove = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateListFromDOM();
      });
    });

    // 초기 스캔
    updateListFromDOM();

    return () => {
      remove();
    };
  }, [editor, selectedKey]);

  const handleReplace = (key: string, replacement: string) => {
    editor.update(() => {
      const node = $getNodeByKey(key);
      if (node && $isForeignWordNode(node)) {
        const textNode = new TextNode(replacement);
        node.replace(textNode);
      }
    });
  };

  if (items.length === 0) return null;

  return (
    <aside
      style={{
        position: "absolute",
        right: 0,
        top: 80,
        width: 280,
        maxHeight: "70%",
        overflowY: "auto",
        background: "#fff",
        borderLeft: "1px solid #e9ecef",
        padding: 12,
        boxShadow: "-6px 6px 20px rgba(0,0,0,0.08)",
        zIndex: 40,
        fontSize: 14,
      }}
    >
      <h3 style={{ margin: "4px 0 8px 0" }}>외래어 검출</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((it) => (
          <div
            key={it.key}
            style={{
              border:
                selectedKey === it.key
                  ? "1px solid #667eea"
                  : "1px solid #f1f3f5",
              borderRadius: 8,
              padding: 8,
              background:
                selectedKey === it.key
                  ? "rgba(102,126,234,0.04)"
                  : "transparent",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
              }}
              onClick={() =>
                setSelectedKey((k) => (k === it.key ? null : it.key))
              }
            >
              <div style={{ fontWeight: 700 }}>{it.text}</div>
              <div style={{ color: "#6c757d" }}>→ {it.replacement}</div>
            </div>

            {selectedKey === it.key ? (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1, color: "#495057" }}>
                  바꿀 단어: <strong>{it.replacement}</strong>
                </div>
                <button
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: "#05A569",
                    cursor: "pointer",
                  }}
                  onClick={() => handleReplace(it.key, it.replacement)}
                >
                  바꾸기
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </aside>
  );
}
