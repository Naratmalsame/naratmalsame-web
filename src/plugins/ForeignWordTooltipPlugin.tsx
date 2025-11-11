import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { ForeignWordTooltip } from "../components/ForeignWordTooltip";
import { TextNode } from "lexical";

export const ForeignWordTooltipPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null
  );
  const [replacement, setReplacement] = useState<string>("");

  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // .foreign-word-highlight 클래스를 가진 요소 찾기
      const foreignWordElement = target.closest(
        ".foreign-word-highlight"
      ) as HTMLElement;

      if (foreignWordElement) {
        const replacementText =
          foreignWordElement.getAttribute("data-replacement");
        if (replacementText) {
          setHoveredElement(foreignWordElement);
          setReplacement(replacementText);
        }
      }
    };

    const handleMouseOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const foreignWordElement = target.closest(".foreign-word-highlight");

      if (foreignWordElement) {
        setHoveredElement(null);
        setReplacement("");
      }
    };

    const editorElement = editor.getRootElement();
    if (editorElement) {
      editorElement.addEventListener("mouseover", handleMouseOver);
      editorElement.addEventListener("mouseout", handleMouseOut);

      return () => {
        editorElement.removeEventListener("mouseover", handleMouseOver);
        editorElement.removeEventListener("mouseout", handleMouseOut);
      };
    }
  }, [editor]);

  // 에디터 변경 감지 - 외래어가 교체되면 툴팁 숨기기
  useEffect(() => {
    return editor.registerMutationListener(TextNode, () => {
      // 텍스트 노드가 변경되면 툴팁 숨기기
      setHoveredElement(null);
      setReplacement("");
    });
  }, [editor]);

  return (
    <ForeignWordTooltip
      targetElement={hoveredElement}
      replacement={replacement}
    />
  );
};
