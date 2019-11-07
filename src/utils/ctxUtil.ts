import Shape from '@/models/Shape';
import Coordinate from '@/models/Coordinate';
import { ARC_RADIUS, ARC_START_ANGLE, ARC_END_ANGLE } from '@/constants/generalConstants';

type CanvasContext = CanvasRenderingContext2D | null;

export const drawShape = (ctx: CanvasContext, shape: Shape) => {
  if (ctx) {
    const coordinates: Coordinate[] = shape.coordinates;

    ctx.beginPath();
    ctx.moveTo(coordinates[0].x, coordinates[0].y);

    for (let index = 1; index < coordinates.length; index++) {
      ctx.lineTo(coordinates[index].x, coordinates[index].y);
    }

    ctx.fillStyle = shape.color;
    ctx.fill();
    ctx.closePath();
  }
};

export const drawCorner = (ctx: CanvasContext, corner: Coordinate) => {
  if (ctx) {
    ctx.beginPath();
    ctx.arc(corner.x, corner.y, ARC_RADIUS, ARC_START_ANGLE, ARC_END_ANGLE);
    ctx.fillStyle = 'grey';
    ctx.strokeStyle = 'grey';
    ctx.fill();
    ctx.stroke();
  }
};

export const isInPath = (ctx: CanvasContext, coordinate: Coordinate, shape: Shape): boolean => {
  if (ctx) {
    const coordinates: Coordinate[] = shape.coordinates;

    ctx.beginPath();
    ctx.moveTo(coordinates[0].x, coordinates[0].y);

    for (let index = 1; index < coordinates.length; index++) {
      ctx.lineTo(coordinates[index].x, coordinates[index].y);
    }

    ctx.closePath();

    return ctx.isPointInPath(coordinate.x, coordinate.y);
  }

  return false;
};

export const isInCorner = (ctx: CanvasContext, corner: Coordinate, coordinate: Coordinate): boolean => {
  if (ctx) {
    ctx.beginPath();
    ctx.arc(corner.x, corner.y, ARC_RADIUS, ARC_START_ANGLE, ARC_END_ANGLE);

    return ctx.isPointInPath(coordinate.x, coordinate.y);
  }

  return false;
};
