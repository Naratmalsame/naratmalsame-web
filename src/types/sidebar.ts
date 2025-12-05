/**
 * 사이드바 관련 타입 정의
 */

export type TabType = "refine" | "target" | "score";

export interface Tab {
  id: TabType;
  label: string;
}

export const SIDEBAR_TABS: Tab[] = [
  { id: "refine", label: "다듬을 단어" },
  { id: "target", label: "목표 설정" },
  { id: "score", label: "종합 점수" },
];
