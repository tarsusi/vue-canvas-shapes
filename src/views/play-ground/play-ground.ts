import { Component, Vue, Watch } from 'vue-property-decorator';
import shapeService from '@/services/shape.service';
import Shape from '@/models/Shape';
import Coordinate from '@/models/Coordinate';
import { drawShape, drawCorner, isInPath, isInCorner } from '@/utils/ctxUtil';
import Corners from '@/models/Corners';
import { generateRandomRectangle } from '@/utils/randomUtil';
import { CORNER_INDEX_NO_VALUE, SHAPE_ID_NO_VALUE, COORDINATE_INCREMENT } from '@/constants/generalConstants';

@Component({
  name: 'play-ground',
})
export default class PlayGround extends Vue {
  public ctx: CanvasRenderingContext2D | null = this.getContextValue();

  protected shapes: Shape[] = [];
  protected corners: Corners = { coordinates: [], shapeId: SHAPE_ID_NO_VALUE };
  protected draggingCornerIndex: number = CORNER_INDEX_NO_VALUE;
  protected selectedShapeId: number = SHAPE_ID_NO_VALUE;

  public getContextValue() {
    const canvasEl = this.$refs.playGround as HTMLCanvasElement;
    return canvasEl && canvasEl.getContext('2d');
  }

  public async mounted() {
    this.ctx = this.getContextValue();

    this.shapes = await shapeService.getShapes();
  }

  @Watch('shapes') protected onShapesChanged() {
    this.drawShapes();
  }

  @Watch('corners') protected onCornersChanged() {
    this.drawShapes();
  }

  protected addRectangle() {
    const { width: canvasWidth, height: canvasHeight } = (this.$refs
      .playGround as HTMLCanvasElement).getBoundingClientRect();

    this.shapes.push(generateRandomRectangle(canvasWidth, canvasHeight));
  }

  protected deleteShape() {
    const shapeIndex = this.shapes.findIndex((shape) => shape.id === this.selectedShapeId);

    this.shapes.splice(shapeIndex, 1);
    this.selectedShapeId = SHAPE_ID_NO_VALUE;
    this.clearCorners();
  }

  protected onESC() {
    if (this.hasAnySelectedShape()) {
      this.selectedShapeId = SHAPE_ID_NO_VALUE;
      this.clearCorners();
    }
  }

  protected onArrowKey(movementFunction: (coordinate: Coordinate) => Coordinate) {
    if (this.hasAnySelectedShape()) {
      const shapeIndex = this.shapes.findIndex((shape) => shape.id === this.selectedShapeId);

      this.shapes[shapeIndex] = {
        ...this.shapes[shapeIndex],
        coordinates: this.shapes[shapeIndex].coordinates.map(movementFunction),
      };

      this.corners.coordinates = this.corners.coordinates.map(movementFunction);

      this.drawShapes();
    }
  }

  protected onLeftKey() {
    this.onArrowKey((coordinate) => ({
      x: coordinate.x - COORDINATE_INCREMENT,
      y: coordinate.y,
    }));
  }

  protected onRightKey() {
    this.onArrowKey((coordinate) => ({
      x: coordinate.x + COORDINATE_INCREMENT,
      y: coordinate.y,
    }));
  }

  protected onUpKey() {
    this.onArrowKey((coordinate) => ({
      x: coordinate.x,
      y: coordinate.y - COORDINATE_INCREMENT,
    }));
  }

  protected onDownKey() {
    this.onArrowKey((coordinate) => ({
      x: coordinate.x,
      y: coordinate.y + COORDINATE_INCREMENT,
    }));
  }

  protected onMouseDown(event: MouseEvent) {
    const mouseCoordinate = this.getMouseCoordinate(event);

    this.draggingCornerIndex = this.corners.coordinates.findIndex((corner: Coordinate) =>
      isInCorner(this.ctx, corner, mouseCoordinate),
    );

    const clickedShape = this.shapes.find((shape: Shape) => isInPath(this.ctx, mouseCoordinate, shape));

    this.selectedShapeId = (clickedShape && clickedShape.id) || SHAPE_ID_NO_VALUE;

    if (!this.hasAnySelectedShape() && !this.hasAnyDraggingCorner()) {
      this.clearCorners();
      this.drawShapes();
    }
  }

  protected onMouseUp() {
    this.draggingCornerIndex = CORNER_INDEX_NO_VALUE;
  }

  protected onMouseMove(event: MouseEvent) {
    if (!this.ctx) {
      return;
    }

    const mouseCoordinate = this.getMouseCoordinate(event);

    if (this.draggingCornerIndex > CORNER_INDEX_NO_VALUE) {
      const draggedShapeIndex = this.shapes.findIndex((shape) => shape.id === this.corners.shapeId);

      this.corners.coordinates[this.draggingCornerIndex] = mouseCoordinate;
      this.shapes[draggedShapeIndex].coordinates = this.corners.coordinates;

      this.drawShapes();
    } else {
      const shapeCollided = this.shapes.find(
        (shape: Shape) => isInPath(this.ctx, mouseCoordinate, shape) || this.selectedShapeId === shape.id,
      );
      const cornerCollided = this.corners.coordinates.find((corner: Coordinate) =>
        isInCorner(this.ctx, corner, mouseCoordinate),
      );

      if (shapeCollided && !this.corners.coordinates.length) {
        this.corners.shapeId = shapeCollided.id;

        for (const element of shapeCollided.coordinates) {
          drawCorner(this.ctx, element);
          this.corners.coordinates.push(element);
        }
      } else if (!shapeCollided && this.corners.coordinates.length && !cornerCollided) {
        this.clearCorners();
      }
    }
  }

  private getMouseCoordinate(event: MouseEvent): Coordinate {
    const { left: canvasLeft, top: canvasTop } = (this.$refs.playGround as HTMLCanvasElement).getBoundingClientRect();

    return { x: event.clientX - canvasLeft, y: event.clientY - canvasTop };
  }

  private hasAnySelectedShape() {
    return this.selectedShapeId !== SHAPE_ID_NO_VALUE;
  }

  private hasAnyDraggingCorner() {
    return this.draggingCornerIndex !== CORNER_INDEX_NO_VALUE;
  }

  private clearCorners() {
    this.corners = { coordinates: [], shapeId: SHAPE_ID_NO_VALUE };
  }

  private drawShapes() {
    const { width: canvasWidth, height: canvasHeight } = (this.$refs
      .playGround as HTMLCanvasElement).getBoundingClientRect();

    if (this.ctx) {
      this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    this.shapes.forEach((shape) => drawShape(this.ctx, shape));
    this.corners.coordinates.forEach((corner) => drawCorner(this.ctx, corner));
  }
}
