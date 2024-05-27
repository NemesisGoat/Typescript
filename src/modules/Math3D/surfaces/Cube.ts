import Surface from "../entites/Surface";
import Point from "../entites/Point";
import Edge from "../entites/Edge";
import Polygon from "../entites/Polygon";

class Cube extends Surface {
    constructor() {
        super([
            new Point(10, 10, 10), //A - 0 
            new Point(10, -10, 10),//B - 1
            new Point(-10, -10, 10), //C - 2
            new Point(-10, 10, 10), //D - 3
            new Point(10, 10, -10), //E - 4
            new Point(10, -10, -10), //F - 5
            new Point(-10, -10, -10), //G - 6
            new Point(-10, 10, -10), //H - 7
        ], [
            new Edge(0, 1),
            new Edge(1, 2),
            new Edge(2, 3),
            new Edge(3, 0),
            new Edge(4, 5),
            new Edge(5, 6),
            new Edge(6, 7),
            new Edge(7, 4),
            new Edge(0, 4),
            new Edge(1, 5),
            new Edge(2, 6),
            new Edge(3, 7),
        ], [
            //зад
            new Polygon([0, 1, 2, 3]),
            //перед
            new Polygon([4, 5, 6, 7], '#800080'),
            //справа
            new Polygon([0, 1, 5, 4], '#000000'),
            //верх
            new Polygon([0, 4, 7, 3], '#FFFF00'),
            //слева
            new Polygon([2, 6, 7, 3], '#008000'),
            //низ
            new Polygon([5, 1, 2, 6], '#0000FF'),
        ]);
    }
}

export default Cube;