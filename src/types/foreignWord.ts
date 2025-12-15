/**
 * 외래어 관련 타입 정의
 */

export interface ForeignWord {
  word: string;
  replacement: string;
}

export interface ForeignWordMatch {
  word: string;
  replacement: string;
  start: number;
  end: number;
}

export interface ForeignWordItem {
  key: string;
  text: string;
  replacement: string;
  category?: string;
  isReplaced?: boolean;
}

export interface ForeignWordSearchResult {
  word: string;
  index: number;
  replacement: string;
}
