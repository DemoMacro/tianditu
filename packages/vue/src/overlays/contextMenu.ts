import { mountOverlay, type OverlayHandle } from "@tianditu/core";
import { defineComponent, inject, onBeforeUnmount, provide, shallowRef, watch } from "vue";

import { CONTEXT_MENU_KEY, MAP_KEY } from "../context";

/**
 * 右键菜单组件：构造后经 map.addOverLay 上屏（官方文档未列挂载方法，
 * 此为 SDK 通行用法，列入真实 tk 验证清单），菜单项以子组件
 * TdtContextMenuItem 声明。open/close 事件直发。
 */
export const TdtContextMenu = defineComponent({
  name: "TdtContextMenu",
  emits: ["open", "close"],
  setup(_props, { emit, expose, slots }) {
    const { map } = inject(MAP_KEY)!;
    const menu = shallowRef<T.ContextMenu>();
    let handle: OverlayHandle<T.ContextMenu> | undefined;

    watch(
      map,
      (current) => {
        if (!current || handle) {
          return;
        }
        handle = mountOverlay(
          { map: current },
          {
            props: () => ({}),
            events: ["open", "close"],
            dispatch: (name, event) => emit(name as never, event),
            // SDK 无参构造内部炸（读 options.width），必须传 options 对象
            create: () => new T.ContextMenu({ width: 160 }),
            // ContextMenu 不是常规 overlay：挂载走 map.addContextMenu；
            // SDK 未提供卸载方法，销毁时仅停同步、解绑事件
            attach: (instance, ctx) => ctx.map.addContextMenu(instance),
            detach: () => {},
          },
        );
        menu.value = handle.instance;
      },
      { immediate: true },
    );

    provide(CONTEXT_MENU_KEY, menu);

    onBeforeUnmount(() => {
      handle?.destroy();
      handle = undefined;
      menu.value = undefined;
    });

    expose({ menu });
    return () => slots.default?.();
  },
});

export interface ContextMenuItemProps {
  text: string;
  disabled?: boolean;
}

/**
 * 右键菜单项组件：callback 转写为 @select 事件，payload 为菜单弹出时的
 * 地理坐标点（官方 MenuItem 语义）。
 */
export const TdtContextMenuItem = defineComponent({
  name: "TdtContextMenuItem",
  props: {
    text: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  emits: {
    select: (_lnglat: T.LngLat) => true,
  },
  setup(props, { emit }) {
    const menuRef = inject(CONTEXT_MENU_KEY)!;
    const item = shallowRef<T.MenuItem>();

    watch(
      menuRef,
      (menu) => {
        if (!menu || item.value) {
          return;
        }
        const created = new T.MenuItem(props.text, (lnglat) => emit("select", lnglat));
        if (props.disabled) {
          created.disable();
        }
        menu.addItem(created);
        item.value = created;
      },
      { immediate: true },
    );

    watch(
      () => props.text,
      (text) => item.value?.setText(text),
    );
    watch(
      () => props.disabled,
      (value) => (value ? item.value?.disable() : item.value?.enable()),
    );

    onBeforeUnmount(() => {
      const menu = menuRef.value;
      if (menu && item.value) {
        menu.removeItem(item.value);
      }
      item.value = undefined;
    });

    return () => null;
  },
});
