/**
 * 메뉴바 관련 타입 정의
 */

export type MenuType = "file" | "edit" | "view" | "window" | "help";

export interface MenuItem {
  label: string;
  action: string;
  shortcut?: string;
  disabled?: boolean;
}

export interface MenuSection {
  items: MenuItem[];
}

export interface MenuConfig {
  [key: string]: MenuSection[];
}
