import { Component, Vue, Prop } from 'vue-property-decorator';
import Shape from '@/models/Shape';
import Coordinate from '@/models/Coordinate';

@Component({
  name: 'shape',
})
export default class CanvasShape extends Vue {
  @Prop() private shape!: Shape;
  @Prop() private ctx!: CanvasRenderingContext2D | null;

  public async mounted() {
    this.drapShape();
  }

  private drapShape() {
    if (this.ctx) {
      const coordinates: Coordinate[] = this.shape.coordinates;

      this.ctx.beginPath();
      this.ctx.moveTo(coordinates[0].x, coordinates[0].y);

      for (let index = 1; index < coordinates.length; index++) {
        this.ctx.lineTo(coordinates[index].x, coordinates[index].y);
      }

      this.ctx.fillStyle = this.shape.color;
      this.ctx.fill();
      this.ctx.closePath();
    }
  }
}
