import { type FC, memo, useCallback } from "react";
import styled from "styled-components";
import { useMenuState } from "../hooks/useMenuState";
import { MENU_ITEMS } from "../constants/menuConfig";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  TRANSITIONS,
  BORDER_RADIUS,
  Z_INDEX,
} from "../constants/uiConfig";
import type { MenuType, MenuItem } from "../types/menu";

// ============================================================================
// Styled Components
// ============================================================================

const MenuBarContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${COLORS.background.lighter};
  border-bottom: 1px solid ${COLORS.border.light};
  padding: ${SPACING.xs} ${SPACING.sm};
  font-size: ${TYPOGRAPHY.fontSize.md};
  font-family: ${TYPOGRAPHY.fontFamily.system};
  user-select: none;
`;

interface MenuItemStyledProps {
  $isActive: boolean;
}

const MenuItemStyled = styled.div<MenuItemStyledProps>`
  position: relative;
  padding: ${SPACING.xs} ${SPACING.sm};
  margin-left: ${SPACING.lg};
  cursor: pointer;
  border-radius: ${BORDER_RADIUS.md};
  background-color: ${(props) =>
    props.$isActive ? COLORS.active : "transparent"};
  transition: background-color ${TRANSITIONS.normal};
  color: ${COLORS.text.primary};

  &:hover {
    background-color: ${COLORS.hover};
  }
`;

const DropdownMenuStyled = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: ${SPACING.xs};
  background-color: ${COLORS.background.lighter};
  border: 1px solid ${COLORS.border.medium};
  border-radius: ${BORDER_RADIUS.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: ${Z_INDEX.dropdown};
`;

interface DropdownItemStyledProps {
  $disabled: boolean;
}

const DropdownItemStyled = styled.div<DropdownItemStyledProps>`
  padding: ${SPACING.sm} ${SPACING.lg};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  color: ${(props) =>
    props.$disabled ? COLORS.text.disabled : COLORS.text.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color ${TRANSITIONS.normal};
  font-size: ${TYPOGRAPHY.fontSize.xs};

  &:hover {
    background-color: ${(props) =>
      props.$disabled ? "transparent" : COLORS.hover};
  }

  &:first-of-type {
    border-top-left-radius: ${BORDER_RADIUS.md};
    border-top-right-radius: ${BORDER_RADIUS.md};
  }

  &:last-of-type {
    border-bottom-left-radius: ${BORDER_RADIUS.md};
    border-bottom-right-radius: ${BORDER_RADIUS.md};
  }
`;

const ShortcutStyled = styled.span`
  color: ${COLORS.text.tertiary};
  font-size: ${TYPOGRAPHY.fontSize.xs};
  margin-left: ${SPACING.xl};
  font-family: ${TYPOGRAPHY.fontFamily.mono};
`;

const DividerStyled = styled.div`
  height: 1px;
  background-color: ${COLORS.border.light};
  margin: ${SPACING.xs} 0;
`;

// ============================================================================
// Sub-components
// ============================================================================

interface DropdownItemProps {
  item: MenuItem;
  onItemClick: (action: string) => void;
}

const DropdownItem: FC<DropdownItemProps> = memo(({ item, onItemClick }) => {
  const handleClick = useCallback(() => {
    onItemClick(item.action);
  }, [item.action, onItemClick]);

  return (
    <DropdownItemStyled
      $disabled={item.disabled || false}
      onClick={handleClick}
    >
      <span>{item.label}</span>
      {item.shortcut && <ShortcutStyled>{item.shortcut}</ShortcutStyled>}
    </DropdownItemStyled>
  );
});

DropdownItem.displayName = "DropdownItem";

interface DropdownMenuProps {
  menuType: MenuType;
  onItemClick: (action: string) => void;
}

const DropdownMenu: FC<DropdownMenuProps> = memo(
  ({ menuType, onItemClick }) => {
    const items = MENU_ITEMS[menuType];

    return (
      <DropdownMenuStyled>
        {items.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.map((item, itemIndex) => (
              <DropdownItem
                key={`${sectionIndex}-${itemIndex}`}
                item={item}
                onItemClick={onItemClick}
              />
            ))}
            {sectionIndex < items.length - 1 && <DividerStyled />}
          </div>
        ))}
      </DropdownMenuStyled>
    );
  },
);

DropdownMenu.displayName = "DropdownMenu";

interface MenuItemProps {
  menuType: MenuType;
  isActive: boolean;
  onToggle: (menuType: MenuType) => void;
  onItemClick: (action: string) => void;
}

const MenuItem: FC<MenuItemProps> = memo(
  ({ menuType, isActive, onToggle, onItemClick }) => {
    const handleClick = useCallback(() => {
      onToggle(menuType);
    }, [menuType, onToggle]);

    return (
      <MenuItemStyled $isActive={isActive} onClick={handleClick}>
        {menuType.charAt(0).toUpperCase() + menuType.slice(1)}
        {isActive && (
          <DropdownMenu menuType={menuType} onItemClick={onItemClick} />
        )}
      </MenuItemStyled>
    );
  },
);

MenuItem.displayName = "MenuItem";

// ============================================================================
// Main Component
// ============================================================================

interface MenuBarProps {
  onMenuAction?: (action: string) => void;
}

const MenuBar: FC<MenuBarProps> = memo(({ onMenuAction }) => {
  const { activeMenu, menuRef, toggleMenu, closeMenu } = useMenuState();

  const handleMenuItemClick = useCallback(
    (action: string) => {
      console.log(`Menu action: ${action}`);
      onMenuAction?.(action);
      closeMenu();
    },
    [onMenuAction, closeMenu],
  );

  const menuTypes: MenuType[] = ["file", "edit", "view", "window", "help"];

  return (
    <MenuBarContainer ref={menuRef}>
      {menuTypes.map((menuType) => (
        <MenuItem
          key={menuType}
          menuType={menuType}
          isActive={activeMenu === menuType}
          onToggle={toggleMenu}
          onItemClick={handleMenuItemClick}
        />
      ))}
    </MenuBarContainer>
  );
});

MenuBar.displayName = "MenuBar";

export default MenuBar;
