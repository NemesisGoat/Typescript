import Edge from "../entites/Edge";
import Point from "../entites/Point";
import Polygon from "../entites/Polygon";
import Surface from "../entites/Surface";

class EllipticParaboloid extends Surface {
    constructor(
        count = 20,
        a = 2,
        b = 2,
        color = '#ff3333',
        center = new Point
    ) {
        super()
        const points: Point[] = [];
        const edges: Edge[] = [];
        const polygons: Polygon[] = [];

        // about points
        const da = Math.PI * 2 / count;
        for (let u = -Math.PI; u < Math.PI; u += da) {
            for (let v = -Math.PI; v < Math.PI; v += da) {
                const x = u * Math.sqrt(a) * Math.cos(v);
                const y = u * Math.sqrt(b) * Math.sin(v);
                const z = u**2 / 2;
                points.push(new Point(x, y, z));
            }
        }
        // about edges
        for (let i = 0; i < points.length; i++) {
            if (points[i + 1]) {
                if (((i + 1) % (count) !== 0)) {
                    edges.push(new Edge(i, i + 1));
                } else {
                    edges.push(new Edge(i, i + 1 - count))
                }
            }
            if (points[i + count]) {
                edges.push(new Edge(i, i + count));
            }
        }

        for (let i = 0; i < points.length; i++) {
            if (points[i + count + 1]) {
                if ((i + 1) % count !== 0) {
                    polygons.push(new Polygon([
                        i,
                        i + 1,
                        i + count + 1,
                        i + count
                    ], color))
                }
            }
            if (points[count]) {
                polygons.push(new Polygon([
                    0,
                    20,
                    39,
                    19
                ], color))
            }

        }

        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = center;
    }
}

export default EllipticParaboloid