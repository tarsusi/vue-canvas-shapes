import { Component, Vue, Watch } from 'vue-property-decorator';
import shapeService from '@/services/shape.service';
import Shape from '@/models/Shape';
import ShapeComponent from '@/components/shape/shape.vue';
import Coordinate from '@/models/Coordinate';
import { drawShape, drawCorner, isInPath, isInCorner } from '@/utils/ctxUtil';

@Component({
  name: 'play-ground',
  components: {
    shape: ShapeComponent,
  },
})
export default class PlayGround extends Vue {
  public ctx: CanvasRenderingContext2D | null = this.getContextValue();

  protected shapes: Shape[] = [];
  protected corners: Coordinate[] = [];

  public getContextValue() {
    const canvasEl = this.$refs.playGround as HTMLCanvasElement;
    return canvasEl && canvasEl.getContext('2d');
  }

  public async mounted() {
    this.ctx = this.getContextValue();

    this.shapes = await shapeService.getShapes();

    (this.$refs.playGround as HTMLCanvasElement).addEventListener('mousemove', this.onMouseMove, false);
  }

  @Watch('shapes') protected onShapesChanged(shapes: Shape[], oldShapes: Shape[]) {
    this.drawShapes();
  }

  @Watch('corners') protected onCornersChanged(corners: Coordinate[], oldCorners: Coordinate[]) {
    this.drawShapes();
  }

  protected beforeDestroy() {
    (this.$refs.playGround as HTMLCanvasElement).removeEventListener('mousemove', this.onMouseMove, false);
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.ctx) {
      return;
    }

    const rect = (this.$refs.playGround as HTMLCanvasElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const shapeCollided = this.shapes.find((shape: Shape) => isInPath(this.ctx, { x, y }, shape));
    const cornerCollided = this.corners.find((corner: Coordinate) => isInCorner(this.ctx, corner, { x, y }));

    if (shapeCollided && !this.corners.length) {
      for (const element of shapeCollided.coordinates) {
        drawCorner(this.ctx, element);
        this.corners.push(element);
      }
    } else if (!shapeCollided && this.corners.length && !cornerCollided) {
      this.corners = [];
    }
  }

  private drawShapes() {
    const rect = (this.$refs.playGround as HTMLCanvasElement).getBoundingClientRect();
    if (this.ctx) {
      this.ctx.clearRect(0, 0, rect.width, rect.height);
    }

    this.shapes.forEach((shape) => drawShape(this.ctx, shape));
    this.corners.forEach((corner) => drawCorner(this.ctx, corner));
  }
}
