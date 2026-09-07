export {};

declare global {
  namespace T {
    class Polygon extends Polyline {
      /** 创建多边形覆盖物对象，传入嵌套数组可创建带洞多边形 */
      constructor(points: LngLat[] | LngLat[][], opts?: PolygonOptions);
      /** 设置多边形的点数组，嵌套数组表示带洞多边形 */
      setLngLats(lnglat: LngLat[] | LngLat[][]): void;
      /** 设置多边形的填充颜色，参数为合法的CSS颜色值。当参数为空字符串时，多边形覆盖物填充颜色与边线颜色相同 */
      setFillColor(color: string): void;
      /** 返回多边形的填充颜色 */
      getFillColor(): string;
      /** 设置多边形的填充透明度。当参数为0时，多边形覆盖物将没有填充效果 */
      setFillOpacity(opacity: number): void;
      /** 返回多边形的填充透明度 */
      getFillOpacity(): number;
    }

    interface PolygonOptions {
      /** 多边形边线颜色。default:"#0000FF" */
      color?: string;
      /** 多边形边线的宽度，以像素为单位。default:3 */
      weight?: number;
      /** 多边形边线的透明度（范围0-1 之间）。default:0.5 */
      opacity?: number;
      /** 多边形填充颜色。当参数为空时，多边形覆盖物将没有填充效果。default:"#0000FF" */
      fillColor?: string;
      /** 多边形填充的透明度（范围0-1 之间）。default:0.2 */
      fillOpacity?: number;
      /** 多边形边线的样式（solid或dashed）。default:"solid" */
      lineStyle?: "solid" | "dashed";
    }

    type PolygonEvents = OverlayEvents<Polygon, LngLat[]>;
  }
}
