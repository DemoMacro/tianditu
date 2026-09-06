import type { PropDefs } from "@tianditu/core";
import type { ComponentObjectPropsOptions } from "vue";

/** defs 的中立 props → vue 运行时 props（attribute/converter 由 WC 侧消费） */
export function vuePropsFromDef<P extends object>(defs: PropDefs<P>): ComponentObjectPropsOptions {
  const out: Record<string, unknown> = {};
  for (const key in defs) {
    const { type, required, default: fallback } = defs[key];
    out[key] = {
      ...(type ? { type } : {}),
      ...(required ? { required: true } : {}),
      ...(fallback !== undefined ? { default: fallback } : {}),
    };
  }
  return out as ComponentObjectPropsOptions;
}
