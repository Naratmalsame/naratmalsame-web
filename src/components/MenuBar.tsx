import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const MenuBarContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #ddd;
  padding: 4px 8px;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  user-select: none;
`;

const MenuItem = styled.div<{ $isActive?: boolean }>`
  position: relative;
  padding: 4px 8px;
  margin-left: 16px;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${(props) => (props.$isActive ? "#e0e0e0" : "transparent")};
  transition: background-color 0.2s;
  color: black;

  &:hover {
    background-color: #e8e8e8;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 2px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 1000;
`;

const DropdownItem = styled.div<{ $disabled?: boolean }>`
  padding: 8px 16px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  color: ${(props) => (props.$disabled ? "#aaa" : "#333")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
  font-size: 12px;

  &:hover {
    background-color: ${(props) =>
      props.$disabled ? "transparent" : "#f0f0f0"};
  }

  &:first-of-type {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-of-type {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const Shortcut = styled.span`
  color: #888;
  font-size: 12px;
  margin-left: 24px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
`;

type MenuType = "file" | "edit" | "view" | "window" | "help";

export default function MenuBar(): React.ReactElement {
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

  const handleMenuClick = (menuName: MenuType): void => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = (action: string): void => {
    console.log(`${action} 클릭됨`);
    setActiveMenu(null);
    // 여기에 각 메뉴 아이템의 실제 동작을 구현할 수 있습니다
  };

  return (
    <MenuBarContainer ref={menuRef}>
      <MenuItem
        $isActive={activeMenu === "file"}
        onClick={() => handleMenuClick("file")}
      >
        파일
        {activeMenu === "file" && (
          <DropdownMenu>
            <DropdownItem onClick={() => handleMenuItemClick("새 문서")}>
              새 문서
              <Shortcut>⌘N</Shortcut>
            </DropdownItem>
            <DropdownItem onClick={() => handleMenuItemClick("열기")}>
              열기
              <Shortcut>⌘O</Shortcut>
            </DropdownItem>
            <Divider />
            <DropdownItem onClick={() => handleMenuItemClick("저장")}>
              저장
              <Shortcut>⌘S</Shortcut>
            </DropdownItem>
            <DropdownItem
              onClick={() => handleMenuItemClick("다른 이름으로 저장")}
            >
              다른 이름으로 저장
              <Shortcut>⇧⌘S</Shortcut>
            </DropdownItem>
            <Divider />
            <DropdownItem onClick={() => handleMenuItemClick("인쇄")}>
              인쇄
              <Shortcut>⌘P</Shortcut>
            </DropdownItem>
          </DropdownMenu>
        )}
      </MenuItem>

      <MenuItem
        $isActive={activeMenu === "edit"}
        onClick={() => handleMenuClick("edit")}
      >
        편집
        {activeMenu === "edit" && (
          <DropdownMenu>
            <DropdownItem onClick={() => handleMenuItemClick("실행 취소")}>
              실행 취소
              <Shortcut>⌘Z</Shortcut>
            </DropdownItem>
            <DropdownItem onClick={() => handleMenuItemClick("다시 실행")}>
              다시 실행
              <Shortcut>⇧⌘Z</Shortcut>
            </DropdownItem>
            <Divider />
            <DropdownItem onClick={() => handleMenuItemClick("잘라내기")}>
              잘라내기
              <Shortcut>⌘X</Shortcut>
            </DropdownItem>
            <DropdownItem onClick={() => handleMenuItemClick("복사")}>
              복사
              <Shortcut>⌘C</Shortcut>
            </DropdownItem>
            <DropdownItem onClick={() => handleMenuItemClick("붙여넣기")}>
              붙여넣기
              <Shortcut>⌘V</Shortcut>
            </DropdownItem>
            <Divider />
            <DropdownItem onClick={() => handleMenuItemClick("모두 선택")}>
              모두 선택
              <Shortcut>⌘A</Shortcut>
            </DropdownItem>
          </DropdownMenu>
        )}
      </MenuItem>

      <MenuItem
        $isActive={activeMenu === "view"}
        onClick={() => handleMenuClick("view")}
      >
        보기
        {activeMenu === "view" && (
          <DropdownMenu>
            <DropdownItem onClick={() => handleMenuItemClick("확대")}>
              확대
              <Shortcut>⌘+</Shortcut>
            </DropdownItem>
            <DropdownItem onClick={() => handleMenuItemClick("축소")}>
              축소
              <Shortcut>⌘-</Shortcut>
            </DropdownItem>
            <DropdownItem onClick={() => handleMenuItemClick("실제 크기")}>
              실제 크기
              <Shortcut>⌘0</Shortcut>
            </DropdownItem>
            <Divider />
            <DropdownItem onClick={() => handleMenuItemClick("전체 화면")}>
              전체 화면
              <Shortcut>⌃⌘F</Shortcut>
            </DropdownItem>
          </DropdownMenu>
        )}
      </MenuItem>

      <MenuItem
        $isActive={activeMenu === "window"}
        onClick={() => handleMenuClick("window")}
      >
        창
        {activeMenu === "window" && (
          <DropdownMenu>
            <DropdownItem onClick={() => handleMenuItemClick("최소화")}>
              최소화
              <Shortcut>⌘M</Shortcut>
            </DropdownItem>
            <DropdownItem onClick={() => handleMenuItemClick("확대/축소")}>
              확대/축소
            </DropdownItem>
            <Divider />
            <DropdownItem
              onClick={() => handleMenuItemClick("모두 앞으로 가져오기")}
            >
              모두 앞으로 가져오기
            </DropdownItem>
          </DropdownMenu>
        )}
      </MenuItem>

      <MenuItem
        $isActive={activeMenu === "help"}
        onClick={() => handleMenuClick("help")}
      >
        도움말
        {activeMenu === "help" && (
          <DropdownMenu>
            <DropdownItem onClick={() => handleMenuItemClick("사용 설명서")}>
              사용 설명서
            </DropdownItem>
            <DropdownItem onClick={() => handleMenuItemClick("키보드 단축키")}>
              키보드 단축키
            </DropdownItem>
            <Divider />
            <DropdownItem onClick={() => handleMenuItemClick("정보")}>
              나랏말싸미에 문의하기
            </DropdownItem>
          </DropdownMenu>
        )}
      </MenuItem>
    </MenuBarContainer>
  );
}
