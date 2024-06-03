import Edge from "../entites/Edge";
import Point from "../entites/Point";
import Polygon from "../entites/Polygon";
import Surface from "../entites/Surface";

class TwoSurfaceHyperboloid extends Surface {
    constructor(
        count = 30,
        a = 3,
        b = 3,
        c = 4,
        color = '#00ff00',
        center = new Point
    ) {
        super()
        const points: Point[] = [];
        const edges: Edge[] = [];
        const polygons: Polygon[] = [];

        // about points
        const da = Math.PI * 2 / count;
        for (let u = 0; u < Math.PI * 2; u += da) {
            for (let v = -Math.PI; v < Math.PI; v += da) {
                const x = a * Math.sinh(u) * Math.cos(v);
                const y = b * Math.sinh(u) * Math.sin(v);
                const z = c * Math.cosh(u);
                points.push(new Point(x, y, z));
            }
        }
        for (let u = 0; u < Math.PI * 2; u += da) {
            for (let v = -Math.PI; v < Math.PI; v += da) {
                const x = a * Math.sinh(u) * Math.cos(v);
                const y = b * Math.sinh(u) * Math.sin(v);
                const z = -c * Math.cosh(u);
                points.push(new Point(x, y, z));
            }
        }
        // about edges
        for (let i = 0; i < points.length; i++) {
            if (points[i + 1]) {
                if (((i + 1) % (count + 1) !== 0)) {
                    edges.push(new Edge(i, i + 1));
                }
            }
            if (points[i + count]) {
                edges.push(new Edge(i, i + count));
            }
        }

        for (let i = 0; i < points.length; i++) {
            if (points[i + count + 1]) {
                polygons.push(new Polygon([
                    i,
                    i + 1,
                    i + count + 1,
                    i + count
                ], color))
            }

        }

        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = center;
    }
}

export default TwoSurfaceHyperboloid;