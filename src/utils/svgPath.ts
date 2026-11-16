import { Point, DrawingTool } from '../types/doodle';

/**
 * Creates a smooth SVG path string from an array of touch points using quadratic bezier curves
 */
export function pointsToSmoothSvgPath(points: Point[]): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) {
    const { x, y } = points[0];
    return `M ${x.toFixed(1)} ${y.toFixed(1)} L ${(x + 0.1).toFixed(1)} ${(y + 0.1).toFixed(1)}`;
  }

  if (points.length === 2) {
    const p0 = points[0];
    const p1 = points[1];
    return `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} L ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 1; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const midX = ((current.x + next.x) / 2).toFixed(1);
    const midY = ((current.y + next.y) / 2).toFixed(1);
    d += ` Q ${current.x.toFixed(1)} ${current.y.toFixed(1)} ${midX} ${midY}`;
  }

  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;

  return d;
}

/**
 * Generates SVG path for geometric shapes (Line, Rectangle, Circle, Arrow)
 */
export function shapeToSvgPath(
  tool: DrawingTool,
  start: Point,
  end: Point
): string {
  const x1 = start.x;
  const y1 = start.y;
  const x2 = end.x;
  const y2 = end.y;

  switch (tool) {
    case 'line':
      return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;

    case 'rectangle': {
      const minX = Math.min(x1, x2).toFixed(1);
      const minY = Math.min(y1, y2).toFixed(1);
      const width = Math.abs(x2 - x1).toFixed(1);
      const height = Math.abs(y2 - y1).toFixed(1);
      return `M ${minX} ${minY} h ${width} v ${height} h -${width} Z`;
    }

    case 'circle': {
      const cx = ((x1 + x2) / 2).toFixed(1);
      const cy = ((y1 + y2) / 2).toFixed(1);
      const rx = (Math.abs(x2 - x1) / 2).toFixed(1);
      const ry = (Math.abs(y2 - y1) / 2).toFixed(1);
      if (parseFloat(rx) < 1 && parseFloat(ry) < 1) return '';
      return `M ${cx} ${(parseFloat(cy) - parseFloat(ry)).toFixed(1)} a ${rx} ${ry} 0 1 0 0.1 0 Z`;
    }

    case 'arrow': {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLength = Math.min(30, Math.max(15, Math.hypot(x2 - x1, y2 - y1) * 0.25));
      const arrowAngle = Math.PI / 7;

      const leftX = x2 - headLength * Math.cos(angle - arrowAngle);
      const leftY = y2 - headLength * Math.sin(angle - arrowAngle);
      const rightX = x2 - headLength * Math.cos(angle + arrowAngle);
      const rightY = y2 - headLength * Math.sin(angle + arrowAngle);

      return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} M ${leftX.toFixed(1)} ${leftY.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} L ${rightX.toFixed(1)} ${rightY.toFixed(1)}`;
    }

    default:
      return '';
  }
}

