export {};

declare global {
  namespace T {
    /**
     * Arc（标绘）
     */
    class Arc {
      constructor(points: LngLat[], opts?: ArcOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface ArcOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * BezierCurve2（标绘）
     */
    class BezierCurve2 {
      constructor(points: LngLat[], opts?: BezierCurve2Options);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface BezierCurve2Options {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * BezierCurve3（标绘）
     */
    class BezierCurve3 {
      constructor(points: LngLat[], opts?: BezierCurve3Options);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface BezierCurve3Options {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * BezierCurveArrow（标绘）
     */
    class BezierCurveArrow {
      constructor(points: LngLat[], opts?: BezierCurveArrowOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface BezierCurveArrowOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * BezierCurveN（标绘）
     */
    class BezierCurveN {
      constructor(points: LngLat[], opts?: BezierCurveNOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface BezierCurveNOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * CardinalCurve（标绘）
     */
    class CardinalCurve {
      constructor(points: LngLat[], opts?: CardinalCurveOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface CardinalCurveOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * CardinalCurveArrow（标绘）
     */
    class CardinalCurveArrow {
      constructor(points: LngLat[], opts?: CardinalCurveArrowOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface CardinalCurveArrowOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * CloseCurve（标绘）
     */
    class CloseCurve {
      constructor(points: LngLat[], opts?: CloseCurveOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface CloseCurveOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
      /** 填充颜色，为空时无填充效果，default "#0000FF" */
      fillColor?: string;
      /** 填充透明度（0-1），default 0.2 */
      fillOpacity?: number;
    }

    /**
     * CurveFlag（标绘）
     */
    class CurveFlag {
      constructor(points: LngLat[], opts?: CurveFlagOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface CurveFlagOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 填充颜色，为空时无填充效果，default "#0000FF" */
      fillColor?: string;
      /** 填充透明度（0-1），default 0.2 */
      fillOpacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * DiagonalArrow（标绘）
     */
    class DiagonalArrow {
      constructor(points: LngLat[], opts?: DiagonalArrowOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface DiagonalArrowOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
      /** 填充颜色，为空时无填充效果，default "#0000FF" */
      fillColor?: string;
      /** 填充透明度（0-1），default 0.2 */
      fillOpacity?: number;
    }

    /**
     * DoubleArrow（标绘）
     */
    class DoubleArrow {
      constructor(points: LngLat[], opts?: DoubleArrowOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface DoubleArrowOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
      /** 填充颜色，为空时无填充效果，default "#0000FF" */
      fillColor?: string;
      /** 填充透明度（0-1），default 0.2 */
      fillOpacity?: number;
    }

    /**
     * DoveTailDiagonalArrow（标绘）
     */
    class DoveTailDiagonalArrow {
      constructor(points: LngLat[], opts?: DoveTailDiagonalArrowOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface DoveTailDiagonalArrowOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
      /** 填充颜色，为空时无填充效果，default "#0000FF" */
      fillColor?: string;
      /** 填充透明度（0-1），default 0.2 */
      fillOpacity?: number;
    }

    /**
     * DoveTailStraightArrow（标绘）
     */
    class DoveTailStraightArrow {
      constructor(points: LngLat[], opts?: DoveTailStraightArrowOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface DoveTailStraightArrowOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
      /** 填充颜色，为空时无填充效果，default "#0000FF" */
      fillColor?: string;
      /** 填充透明度（0-1），default 0.2 */
      fillOpacity?: number;
    }

    /**
     * GatheringPlace（标绘）
     */
    class GatheringPlace {
      constructor(points: LngLat[], opts?: GatheringPlaceOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface GatheringPlaceOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
      /** 填充颜色，为空时无填充效果，default "#0000FF" */
      fillColor?: string;
      /** 填充透明度（0-1），default 0.2 */
      fillOpacity?: number;
    }

    /**
     * ParallelSearch（标绘）
     */
    class ParallelSearch {
      constructor(points: LngLat[], opts?: ParallelSearchOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface ParallelSearchOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * PolylineArrow（标绘）
     */
    class PolylineArrow {
      constructor(points: LngLat[], opts?: PolylineArrowOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface PolylineArrowOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * RectFlag（标绘）
     */
    class RectFlag {
      constructor(points: LngLat[], opts?: RectFlagOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface RectFlagOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 填充颜色，为空时无填充效果，default "#0000FF" */
      fillColor?: string;
      /** 填充透明度（0-1），default 0.2 */
      fillOpacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * RoundRect（标绘）
     */
    class RoundRect {
      constructor(points: LngLat[], opts?: RoundRectOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface RoundRectOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
      /** 填充颜色，为空时无填充效果，default "#0000FF" */
      fillColor?: string;
      /** 填充透明度（0-1），default 0.2 */
      fillOpacity?: number;
    }

    /**
     * Sector（标绘）
     */
    class Sector {
      constructor(points: LngLat[], opts?: SectorOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface SectorOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
      /** 填充颜色，为空时无填充效果，default "#0000FF" */
      fillColor?: string;
      /** 填充透明度（0-1），default 0.2 */
      fillOpacity?: number;
    }

    /**
     * SectorSearch（标绘）
     */
    class SectorSearch {
      constructor(points: LngLat[], opts?: SectorSearchOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface SectorSearchOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * StraightArrow（标绘）
     */
    class StraightArrow {
      constructor(points: LngLat[], opts?: StraightArrowOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface StraightArrowOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
      /** 填充颜色，为空时无填充效果，default "#0000FF" */
      fillColor?: string;
      /** 填充透明度（0-1），default 0.2 */
      fillOpacity?: number;
    }

    /**
     * TriangleFlag（标绘）
     */
    class TriangleFlag {
      constructor(points: LngLat[], opts?: TriangleFlagOptions);
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }

    interface TriangleFlagOptions {
      /** 线颜色，default "#0000FF" */
      color?: string;
      /** 线宽度，以像素为单位，default 3 */
      weight?: number;
      /** 透明度（0-1），default 0.5 */
      opacity?: number;
      /** 填充颜色，为空时无填充效果，default "#0000FF" */
      fillColor?: string;
      /** 填充透明度（0-1），default 0.2 */
      fillOpacity?: number;
      /** 线样式，default "solid" */
      lineStyle?: "solid" | "dashed";
    }

    /**
     * 自由线（标绘）。官方无独立文档页，经由 HandDrawingTool.getLayers 引用
     */
    class HandDrawing {
      /** 设置点数组 */
      setLngLats(lnglats: LngLat[]): void;
      /** 返回控制点数组 */
      getLngLats(): LngLat[];
    }
  }
}
