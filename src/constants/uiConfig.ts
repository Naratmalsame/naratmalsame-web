/**
 * UI 공통 설정 상수
 */

// 색상 팔레트
export const COLORS = {
  primary: "#007AFF",
  secondary: "#5AC8FA",
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  background: {
    light: "#f8f8f8",
    lighter: "#ffffff",
  },
  border: {
    light: "#ddd",
    medium: "#ccc",
    dark: "#e9ecef",
  },
  text: {
    primary: "#212529",
    secondary: "#666",
    tertiary: "#888",
    disabled: "#aaa",
  },
  hover: "#e8e8e8",
  active: "#e0e0e0",
} as const;

// 간격(spacing)
export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
} as const;

// 타이포그래피
export const TYPOGRAPHY = {
  fontSize: {
    xs: "12px",
    sm: "13px",
    md: "14px",
    lg: "16px",
    xl: "18px",
    xxl: "24px",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontFamily: {
    system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
  },
} as const;

// 애니메이션
export const TRANSITIONS = {
  fast: "0.15s ease-in-out",
  normal: "0.2s ease-in-out",
  slow: "0.3s ease-in-out",
} as const;

// 경계 반경
export const BORDER_RADIUS = {
  sm: "2px",
  md: "4px",
  lg: "8px",
  full: "50%",
} as const;

// Z-index
export const Z_INDEX = {
  dropdown: 1000,
  modal: 2000,
  tooltip: 1500,
} as const;

// 미디어 쿼리 breakpoints
export const BREAKPOINTS = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
  wide: "1440px",
} as const;
