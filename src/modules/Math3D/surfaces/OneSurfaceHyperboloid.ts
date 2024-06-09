import Edge from "../entites/Edge";
import Point from "../entites/Point";
import Polygon from "../entites/Polygon";
import Surface from "../entites/Surface";

class OneSurfaceHyperboloid extends Surface {
    constructor(
        count = 30,
        a = 1,
        b = 1,
        c = 1,
        color = '#0000ff',
        center = new Point) {
        super()

        const points: Point[] = [];
        const edges: Edge[] = [];
        const polygons: Polygon[] = [];

        //точки
        const dt = Math.PI * 2 / count;
        for (let i = -Math.PI; i <= Math.PI; i += dt) {
            for (let j = 0; j < 2 * Math.PI; j += dt) {
                points.push(new Point(
                    a * Math.cosh(i) * Math.cos(j),
                    c * Math.sinh(i),
                    b * Math.cosh(i) * Math.sin(j)
                ));

            }
        }
        //ребра
        for (let i = 0; i < points.length; i++) {
            //вдоль
            if (i + 1 < points.length && (i + 1) % count !== 0) {
                edges.push(new Edge(
                    i,
                    i + 1
                ));
            } else if (i + 1 >= count && (i + 1) % count === 0) {
                edges.push(new Edge(
                    i,
                    i + 1 - count
                ));
            }
        }

        //полигоны
        for (let i = 0; i < points.length; i++) {
            if (i + 1 + count < points.length && (i + 1) % count !== 0) {
                polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], color));
            } else if (i + count < points.length && (i + 1) % count === 0) {
                polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color))
            }
        }


        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = center;
    }
}

export default OneSurfaceHyperboloid;