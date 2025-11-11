import { useEffect, useState } from "react";
import styled from "styled-components";

const TooltipContainer = styled.div<{
  $x: number;
  $y: number;
  $visible: boolean;
}>`
  position: fixed;
  left: ${(props) => props.$x}px;
  top: ${(props) => props.$y}px;
  transform: translate(-50%, 8px);
  border-radius: 10px;
  border: 1px solid #a5e4cd;
  background: #fff;
  box-shadow: 2px 3px 8px 0 rgba(5, 165, 105, 0.1);
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
`;

const SuggestText = styled.span`
  color: #000;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 19.2px;
`;

const ReplaceBox = styled.div`
  width: fit-content;
  background: rgba(5, 165, 105, 0.14);
`;

const ReplaceText = styled.span`
  color: #05a569;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19.2px;
`;

interface ForeignWordTooltipProps {
  targetElement: HTMLElement | null;
  replacement: string;
}

export const ForeignWordTooltip = ({
  targetElement,
  replacement,
}: ForeignWordTooltipProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!targetElement) {
      setVisible(false);
      return;
    }

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom,
      });
      setVisible(true);
    };

    updatePosition();

    // 스크롤 이벤트 리스너
    const handleScroll = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [targetElement]);

  if (!targetElement) return null;

  return (
    <TooltipContainer $x={position.x} $y={position.y} $visible={visible}>
      <SuggestText>이런 단어는 어때요?</SuggestText>
      <ReplaceBox>
        <ReplaceText>{replacement}</ReplaceText>
      </ReplaceBox>
    </TooltipContainer>
  );
};
