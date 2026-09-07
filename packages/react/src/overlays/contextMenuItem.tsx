import { forwardRef, useContext, useEffect, useImperativeHandle, useRef } from "react";

import { MenuContext } from "../context";

export interface ContextMenuItemProps {
  text: string;
  disabled?: boolean;
  /** 菜单项点击回调，payload 为菜单弹出时的地理坐标点（官方 MenuItem 语义） */
  onSelect?: (lnglat: T.LngLat) => void;
}

/**
 * 右键菜单项组件：callback 转写为 onSelect 回调。挂在 TdtContextMenu
 * 内部，经 Context 取菜单实例。
 */
export const TdtContextMenuItem = forwardRef<T.MenuItem | undefined, ContextMenuItemProps>(
  function TdtContextMenuItem(props, ref) {
    const menu = useContext(MenuContext);
    const latest = useRef(props);
    latest.current = props;
    const itemRef = useRef<T.MenuItem | undefined>(undefined);

    useEffect(() => {
      if (!menu || itemRef.current) {
        return;
      }
      const created = new T.MenuItem(props.text, (lnglat) => latest.current.onSelect?.(lnglat));
      if (props.disabled) {
        created.disable();
      }
      menu.addItem(created);
      itemRef.current = created;
      return () => {
        menu.removeItem(created);
        itemRef.current = undefined;
      };
    }, [menu]);

    useEffect(() => {
      itemRef.current?.setText(props.text);
    }, [props.text]);
    useEffect(() => {
      if (props.disabled) {
        itemRef.current?.disable();
      } else {
        itemRef.current?.enable();
      }
    }, [props.disabled]);

    useImperativeHandle(ref, () => itemRef.current, []);
    return null;
  },
);
