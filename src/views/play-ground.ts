import { Component, Prop, Vue } from 'vue-property-decorator';
import shapeService from '@/services/shape.service';

@Component({
  name: 'play-ground',
})
export default class PlayGround extends Vue {
  public async mounted() {
    const shapes = await shapeService.getShapes();

    console.log(shapes);
  }
}
