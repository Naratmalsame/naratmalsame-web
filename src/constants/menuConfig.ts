/**
 * 메뉴바 설정 및 상수
 */

import type { MenuType, MenuItem } from "../types/menu";

export const MENU_ITEMS: Record<MenuType, MenuItem[][]> = {
  file: [
    [
      { label: "새 문서", action: "new", shortcut: "⌘N" },
      { label: "열기", action: "open", shortcut: "⌘O" },
    ],
    [
      { label: "저장", action: "save", shortcut: "⌘S" },
      { label: "다른 이름으로 저장", action: "save-as", shortcut: "⇧⌘S" },
    ],
    [{ label: "인쇄", action: "print", shortcut: "⌘P" }],
  ],
  edit: [
    [
      { label: "실행 취소", action: "undo", shortcut: "⌘Z" },
      { label: "다시 실행", action: "redo", shortcut: "⇧⌘Z" },
    ],
    [
      { label: "잘라내기", action: "cut", shortcut: "⌘X" },
      { label: "복사", action: "copy", shortcut: "⌘C" },
      { label: "붙여넣기", action: "paste", shortcut: "⌘V" },
    ],
    [{ label: "모두 선택", action: "select-all", shortcut: "⌘A" }],
  ],
  view: [
    [
      { label: "확대", action: "zoom-in", shortcut: "⌘+" },
      { label: "축소", action: "zoom-out", shortcut: "⌘-" },
      { label: "실제 크기", action: "zoom-reset", shortcut: "⌘0" },
    ],
    [{ label: "전체 화면", action: "fullscreen", shortcut: "⌃⌘F" }],
  ],
  window: [
    [
      { label: "최소화", action: "minimize", shortcut: "⌘M" },
      { label: "확대/축소", action: "zoom-toggle" },
    ],
    [{ label: "모두 앞으로 가져오기", action: "bring-to-front" }],
  ],
  help: [
    [
      { label: "사용 설명서", action: "help-manual" },
      { label: "키보드 단축키", action: "help-shortcuts" },
    ],
    [{ label: "나랏말싸미에 문의하기", action: "help-contact" }],
  ],
};
