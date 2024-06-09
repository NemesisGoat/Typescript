import Edge from "../entites/Edge";
import Point from "../entites/Point";
import Polygon from "../entites/Polygon";
import Surface from "../entites/Surface";

class ParabolicCylinder extends Surface {
    constructor(
        count = 20,
        a = 5,
        b = 2,
        color = '#00ff00',
        center = new Point
    ) {
        super()
        const points: Point[] = [];
        const edges: Edge[] = [];
        const polygons: Polygon[] = [];

        const dt = 2 * Math.PI / count;
        for (let i = -Math.PI; i <= Math.PI; i += dt) {
            for (let j = -Math.PI; j < Math.PI; j += dt) {
                points.push(new Point(
                    b * Math.sinh(i),
                    j * 2,
                    a * Math.cosh(i)
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
            } else if ((i + 1) % count === 0) {
                edges.push(new Edge(
                    i,
                    i + 1 - count
                ));
            }
            //поперек
            if (i < points.length - count) {
                edges.push(new Edge(
                    i,
                    i + count
                ));
            }
        }

        for (let i = 0; i < points.length; i++) {
            if (i + 1 + count < points.length && (i + 1) % count !== 0) {
                polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
            } else if (i + count < points.length && (i + 1) % count === 0) {
                polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count]))
            }
        }
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = center;
    }

}

export default ParabolicCylinder