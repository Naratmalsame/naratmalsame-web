/**
 * URL 관련 유틸리티 함수
 */

import type { Preview } from "../types/editor";

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

  // 끝의 구두점 제거
  sanitized = sanitized.replace(/[.,!?;:]+$/g, "");
  sanitized = sanitized.replace(/[)\]]+$/g, "");

  return sanitized;
}

/**
 * YouTube 동영상 ID를 추출합니다.
 */
function extractYouTubeVideoId(url: URL): string | null {
  const host = url.hostname.toLowerCase();

  // youtu.be 짧은 URL 처리
  if (host.includes(".be")) {
    return url.pathname.slice(1);
  }

  // 정규 YouTube URL: v 파라미터
  let videoId = url.searchParams.get("v") || "";

  // /embed/VIDEOID 경로 처리
  if (!videoId && url.pathname.startsWith("/embed/")) {
    videoId = url.pathname.split("/embed/")[1] || "";
  }

  // 남은 쿼리나 구두점 제거
  videoId = (videoId || "")
    .split(new RegExp("[?&/\\s]+"))[0]
    .replace(/[.,)!\]]+$/g, "");

  return videoId || null;
}

/**
 * Vimeo 동영상 ID를 추출합니다.
 */
function extractVimeoVideoId(url: URL): string | null {
  const parts = url.pathname.split("/").filter(Boolean);
  let id = parts[parts.length - 1] || "";
  id = id.split(new RegExp("[?&/\\s]+"))[0].replace(/[.,)!\]]+$/g, "");
  return id || null;
}

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
    const allowedIframeHosts = new Set(["example.com"]);
    if (allowedIframeHosts.has(host)) {
      return { type: "iframe", src: rawUrl };
    }

    // 기본 링크
    return { type: "link", src: rawUrl };
  } catch (error) {
    console.error("[URL Preview Error]", error);
    return null;
  }
}

/**
 * 텍스트에서 URL을 추출합니다.
 */
export function extractUrlFromText(text: string): string | null {
  const urlMatch = text.match(/https?:\/\/\S+/i);
  return urlMatch?.[0]?.trim() || null;
}
