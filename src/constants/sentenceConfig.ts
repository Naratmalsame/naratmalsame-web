/**
 * 문장 분석 관련 설정
 */

/**
 * 문장 종결 표현 정규식
 */
export const SENTENCE_TERMINATORS = /[.!?]/;

/**
 * 미완성 문장 처리 타이머 (밀리초)
 */
export const INCOMPLETE_SENTENCE_TIMEOUT = 2000;

/**
 * 문장 고유 ID 접두사
 */
export const SENTENCE_ID_PREFIX = "sentence-";
