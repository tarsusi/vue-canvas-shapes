import { Component, Vue } from 'vue-property-decorator';
import shapeService from '@/services/shape.service';
import Shape from '@/models/Shape';
import ShapeComponent from '@/components/shape/shape.vue';

@Component({
  name: 'play-ground',
  components: {
    shape: ShapeComponent,
  },
})
export default class PlayGround extends Vue {
  public ctx: CanvasRenderingContext2D | null = this.getContextValue();

  protected shapes: Shape[] = [];

  public getContextValue() {
    const canvasEl = this.$refs.playGround as HTMLCanvasElement;
    return canvasEl && canvasEl.getContext('2d');
  }

  public async mounted() {
    this.ctx = this.getContextValue();

    this.shapes = await shapeService.getShapes();
  }
}
