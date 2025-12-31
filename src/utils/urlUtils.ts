/**
 * URL 관련 유틸리티 함수
 */

import type { Preview } from "../types/editor";

// ============================================================================
// URL 정규식 및 상수
// ============================================================================

const URL_REGEX = /https?:\/\/\S+/i;
const PUNCTUATION_REGEX = /[.,!?;:]+$/g;
const BRACKET_REGEX = /[)\]]+$/g;
const QUERY_SEPARATOR_REGEX = /[?&/\s]+/;

const ALLOWED_IFRAME_HOSTS = new Set(["example.com"]);

// ============================================================================
// URL 정제 및 추출
// ============================================================================

/**
 * URL 문자열을 정리합니다.
 * - 양쪽 공백 제거
 * - <>, 따옴표 제거
 * - 끝의 구두점 제거
 */
export function sanitizeUrl(input: string): string {
  let sanitized = input.trim();

  // <> 또는 따옴표 제거
  if (
    (sanitized.startsWith("<") && sanitized.endsWith(">")) ||
    (sanitized.startsWith('"') && sanitized.endsWith('"')) ||
    (sanitized.startsWith("'") && sanitized.endsWith("'"))
  ) {
    sanitized = sanitized.slice(1, -1);
  }

  // 끝의 구두점과 괄호 제거
  sanitized = sanitized.replace(PUNCTUATION_REGEX, "");
  sanitized = sanitized.replace(BRACKET_REGEX, "");

  return sanitized;
}

/**
 * 텍스트에서 URL을 추출합니다.
 */
export function extractUrlFromText(text: string): string | null {
  const urlMatch = text.match(URL_REGEX);
  return urlMatch?.[0]?.trim() ?? null;
}

// ============================================================================
// 비디오 ID 추출
// ============================================================================

/**
 * YouTube 동영상 ID를 추출합니다.
 */
function extractYouTubeVideoId(url: URL): string | null {
  const host = url.hostname.toLowerCase();

  // youtu.be 짧은 URL 처리: youtu.be/VIDEOID
  if (host.includes(".be")) {
    return url.pathname.slice(1).split(QUERY_SEPARATOR_REGEX)[0] || null;
  }

  // 정규 YouTube URL: ?v=VIDEOID
  let videoId = url.searchParams.get("v") || "";

  // /embed/VIDEOID 경로 처리
  if (!videoId && url.pathname.startsWith("/embed/")) {
    videoId = url.pathname.split("/embed/")[1] || "";
  }

  // 남은 쿼리나 구두점 제거
  videoId = (videoId || "").split(QUERY_SEPARATOR_REGEX)[0];
  return videoId || null;
}

/**
 * Vimeo 동영상 ID를 추출합니다.
 */
function extractVimeoVideoId(url: URL): string | null {
  const parts = url.pathname.split("/").filter(Boolean);
  const id = parts[parts.length - 1];

  if (!id) return null;

  return id.split(QUERY_SEPARATOR_REGEX)[0] || null;
}

// ============================================================================
// 미리보기 생성
// ============================================================================

/**
 * URL로부터 미리보기 정보를 생성합니다.
 */
export function generatePreview(rawUrl: string): Preview | null {
  try {
    const cleaned = sanitizeUrl(rawUrl);
    const url = new URL(cleaned);
    const host = url.hostname.toLowerCase();

    // YouTube 처리
    if (host.includes("youtube") || host.includes("youtu")) {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        return {
          type: "embed",
          src: `https://www.youtube.com/embed/${videoId}`,
        };
      }
    }

    // Vimeo 처리
    if (host.includes("vimeo.com")) {
      const videoId = extractVimeoVideoId(url);
      if (videoId) {
        return {
          type: "embed",
          src: `https://player.vimeo.com/video/${videoId}`,
        };
      }
    }

    // 허용된 iframe 호스트
    if (ALLOWED_IFRAME_HOSTS.has(host)) {
      return { type: "iframe", src: cleaned };
    }

    // 기본 링크
    return { type: "link", src: cleaned };
  } catch (error) {
    if (error instanceof Error) {
      console.error("[URL Preview Error]:", error.message);
    }
    return null;
  }
}
