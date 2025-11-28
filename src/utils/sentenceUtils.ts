/**
 * 문장 분석 관련 유틸리티 함수
 */

import { SENTENCE_TERMINATORS, SENTENCE_ID_PREFIX } from "../constants/sentenceConfig";
import type { Sentence } from "../types/lstm";

/**
 * 문장 고유 ID를 생성합니다.
 */
export function generateSentenceId(): string {
  return `${SENTENCE_ID_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * 텍스트를 문장 단위로 분할합니다.
 * 종결 표현(. ! ?)을 기준으로 분할하며, 완성 여부를 표시합니다.
 */
export function splitIntoSentences(text: string): Sentence[] {
  const sentences: Sentence[] = [];
  let currentStart = 0;

  for (let i = 0; i < text.length; i++) {
    if (SENTENCE_TERMINATORS.test(text[i])) {
      const sentenceText = text.slice(currentStart, i + 1);
      sentences.push({
        text: sentenceText,
        start: currentStart,
        end: i + 1,
        isComplete: true,
      });

      // 종결 표현 다음의 공백 문자들을 건너뛰기
      let nextStart = i + 1;
      while (nextStart < text.length && /\s/.test(text[nextStart])) {
        nextStart++;
      }
      currentStart = nextStart;
    }
  }

  // 마지막 문장이 종결 표현 없이 끝나는 경우 (작성 중인 문장)
  if (currentStart < text.length) {
    const remainingText = text.slice(currentStart);
    // 공백만 있는 경우는 문장으로 처리하지 않음
    if (remainingText.trim().length > 0) {
      sentences.push({
        text: remainingText,
        start: currentStart,
        end: text.length,
        isComplete: false,
      });
    }
  }

  return sentences;
}

/**
 * 문장이 완성되었는지 확인합니다.
 */
export function isSentenceComplete(text: string): boolean {
  if (!text) return false;
  return SENTENCE_TERMINATORS.test(text[text.length - 1]);
}

/**
 * 문장 키를 생성합니다 (텍스트 기반 고유 식별자).
 */
export function createSentenceKey(sentenceText: string): string {
  return sentenceText.trim();
}
