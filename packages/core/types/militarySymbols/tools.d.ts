export {};

declare global {
  namespace T {
    /**
     * ArcTool（标绘工具）
     */
    class ArcTool extends MilitaryTool<Arc> {
      constructor(map: Map, options: ArcToolOptions);
    }

    /**
     * BezierCurve2Tool（标绘工具）
     */
    class BezierCurve2Tool extends MilitaryTool<BezierCurve2> {
      constructor(map: Map, options: BezierCurve2ToolOptions);
    }

    /**
     * BezierCurve3Tool（标绘工具）
     */
    class BezierCurve3Tool extends MilitaryTool<BezierCurve3> {
      constructor(map: Map, options: BezierCurve3ToolOptions);
    }

    /**
     * BezierCurveArrowTool（标绘工具）
     */
    class BezierCurveArrowTool extends MilitaryTool<BezierCurveArrow> {
      constructor(map: Map, options: BezierCurveArrowToolOptions);
    }

    /**
     * BezierCurveNTool（标绘工具）
     */
    class BezierCurveNTool extends MilitaryTool<BezierCurveN> {
      constructor(map: Map, options: BezierCurveNToolOptions);
    }

    /**
     * CardinalCurveArrowTool（标绘工具）
     */
    class CardinalCurveArrowTool extends MilitaryTool<CardinalCurveArrow> {
      constructor(map: Map, options: CardinalCurveArrowToolOptions);
    }

    /**
     * CardinalCurveTool（标绘工具）
     */
    class CardinalCurveTool extends MilitaryTool<CardinalCurve> {
      constructor(map: Map, options: CardinalCurveToolOptions);
    }

    /**
     * CloseCurveTool（标绘工具）
     */
    class CloseCurveTool extends MilitaryTool<CloseCurve> {
      constructor(map: Map, options: CloseCurveToolOptions);
    }

    /**
     * CurveFlagTool（标绘工具）
     */
    class CurveFlagTool extends MilitaryTool<CurveFlag> {
      constructor(map: Map, options: CurveFlagToolOptions);
    }

    /**
     * DiagonalArrowTool（标绘工具）
     */
    class DiagonalArrowTool extends MilitaryTool<DiagonalArrow> {
      constructor(map: Map, options: DiagonalArrowToolOptions);
    }

    /**
     * DoubleArrowTool（标绘工具）
     */
    class DoubleArrowTool extends MilitaryTool<DoubleArrow> {
      constructor(map: Map, options: DoubleArrowToolOptions);
    }

    /**
     * DoveTailDiagonalArrowTool（标绘工具）
     */
    class DoveTailDiagonalArrowTool extends MilitaryTool<DoveTailDiagonalArrow> {
      constructor(map: Map, options: DoveTailDiagonalArrowToolOptions);
    }

    /**
     * DoveTailStraightArrowTool（标绘工具）
     */
    class DoveTailStraightArrowTool extends MilitaryTool<DoveTailStraightArrow> {
      constructor(map: Map, options: DoveTailStraightArrowToolOptions);
    }

    /**
     * GatheringPlaceTool（标绘工具）
     */
    class GatheringPlaceTool extends MilitaryTool<GatheringPlace> {
      constructor(map: Map, options: GatheringPlaceToolOptions);
    }

    /**
     * HandDrawingTool（标绘工具）
     */
    class HandDrawingTool extends MilitaryTool<HandDrawing> {
      constructor(map: Map, options: HandDrawingToolOptions);
    }

    /**
     * ParallelSearchTool（标绘工具）
     */
    class ParallelSearchTool extends MilitaryTool<ParallelSearch> {
      constructor(map: Map, options: ParallelSearchToolOptions);
    }

    /**
     * PolylineArrowTool（标绘工具）
     */
    class PolylineArrowTool extends MilitaryTool<PolylineArrow> {
      constructor(map: Map, options: PolylineArrowToolOptions);
    }

    /**
     * RectFlagTool（标绘工具）
     */
    class RectFlagTool extends MilitaryTool<RectFlag> {
      constructor(map: Map, options: RectFlagToolOptions);
    }

    /**
     * RoundRectTool（标绘工具）
     */
    class RoundRectTool extends MilitaryTool<RoundRect> {
      constructor(map: Map, options: RoundRectToolOptions);
    }

    /**
     * SectorSearchTool（标绘工具）
     */
    class SectorSearchTool extends MilitaryTool<SectorSearch> {
      constructor(map: Map, options: SectorSearchToolOptions);
    }

    /**
     * SectorTool（标绘工具）
     */
    class SectorTool extends MilitaryTool<Sector> {
      constructor(map: Map, options: SectorToolOptions);
    }

    /**
     * StraightArrowTool（标绘工具）
     */
    class StraightArrowTool extends MilitaryTool<StraightArrow> {
      constructor(map: Map, options: StraightArrowToolOptions);
    }

    /**
     * TriangleFlagTool（标绘工具）
     */
    class TriangleFlagTool extends MilitaryTool<TriangleFlag> {
      constructor(map: Map, options: TriangleFlagToolOptions);
    }

    // 各工具配置项官方均只列 style 与 layers，统一继承公共接口
    interface ArcToolOptions extends MilitaryToolOptions {}
    interface BezierCurve2ToolOptions extends MilitaryToolOptions {}
    interface BezierCurve3ToolOptions extends MilitaryToolOptions {}
    interface BezierCurveArrowToolOptions extends MilitaryToolOptions {}
    interface BezierCurveNToolOptions extends MilitaryToolOptions {}
    interface CardinalCurveArrowToolOptions extends MilitaryToolOptions {}
    interface CardinalCurveToolOptions extends MilitaryToolOptions {}
    interface CloseCurveToolOptions extends MilitaryToolOptions {}
    interface CurveFlagToolOptions extends MilitaryToolOptions {}
    interface DiagonalArrowToolOptions extends MilitaryToolOptions {}
    interface DoubleArrowToolOptions extends MilitaryToolOptions {}
    interface DoveTailDiagonalArrowToolOptions extends MilitaryToolOptions {}
    interface DoveTailStraightArrowToolOptions extends MilitaryToolOptions {}
    interface GatheringPlaceToolOptions extends MilitaryToolOptions {}
    interface HandDrawingToolOptions extends MilitaryToolOptions {}
    interface ParallelSearchToolOptions extends MilitaryToolOptions {}
    interface PolylineArrowToolOptions extends MilitaryToolOptions {}
    interface RectFlagToolOptions extends MilitaryToolOptions {}
    interface RoundRectToolOptions extends MilitaryToolOptions {}
    interface SectorSearchToolOptions extends MilitaryToolOptions {}
    interface SectorToolOptions extends MilitaryToolOptions {}
    interface StraightArrowToolOptions extends MilitaryToolOptions {}
    interface TriangleFlagToolOptions extends MilitaryToolOptions {}
  }
}
