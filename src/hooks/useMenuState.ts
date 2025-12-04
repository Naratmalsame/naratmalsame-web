/**
 * 메뉴 상태 관리 커스텀 훅
 */

import { useState, useEffect, useRef } from "react";
import type { MenuType } from "../types/menu";

export function useMenuState() {
  const [activeMenu, setActiveMenu] = useState<MenuType | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    if (activeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  const toggleMenu = (menuName: MenuType) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  return {
    activeMenu,
    menuRef,
    toggleMenu,
    closeMenu,
  };
}
