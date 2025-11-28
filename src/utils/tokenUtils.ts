/**
 * 토큰 변환 관련 유틸리티 함수
 */

import * as Hangul from "hangul-js";
import { TOKEN_DICTIONARY, DEFAULT_TOKEN_VALUE } from "../constants/tokenDictionary";

/**
 * 한글 문자열을 자모 분리하여 토큰 배열로 변환합니다.
 */
export function textToTokens(text: string): number[] {
  const jamos = Hangul.disassemble(text);
  return jamos.map((jamo) => TOKEN_DICTIONARY[jamo] || DEFAULT_TOKEN_VALUE);
}

/**
 * 단일 문자를 토큰으로 변환합니다.
 */
export function charToToken(char: string): number {
  return TOKEN_DICTIONARY[char] || DEFAULT_TOKEN_VALUE;
}
