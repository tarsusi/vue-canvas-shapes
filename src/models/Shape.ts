import Coordinate from './Coordinate';

export default interface Shape {
  id: number;
  coordinates: Coordinate[];
  color: string;
  label: string;
}
