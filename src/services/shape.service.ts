import { SHAPES_API_ENDPOINT } from '@/constants/generalConstants';
import Shape from '@/models/Shape';

class ShapeService {
  public async getShapes(): Promise<Shape[]> {
    const response: Response = await fetch(SHAPES_API_ENDPOINT);

    const shapes: Shape[] = await response.json();

    return shapes;
  }
}

export default new ShapeService();
