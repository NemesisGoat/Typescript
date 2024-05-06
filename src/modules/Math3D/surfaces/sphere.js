import Surface from "../entities/Surface";
import Point from "../entities/Point"
import Edge from "../entities/Edge"
import Polygon from "../entities/Polygon"

class Sphere extends Surface {
    constructor ( {count = 20, radius = 10, color = '#ff3333', x0 = 0, y0 = 0, z0 = 0} ) {
        super({});
        const points = [];
        const edges = [];
        const polygons = []
        // about points
        const thetaDelta = Math.PI / count;
        const phiDelta = (Math.PI * 2) / count;

        for (let theta = 0; theta <= Math.PI; theta += thetaDelta) {
            for (let phi = 0; phi < Math.PI * 2; phi += phiDelta) {
                const x = radius * Math.sin(theta) * Math.cos(phi);
                const y = radius * Math.sin(theta) * Math.sin(phi);
                const z = radius * Math.cos(theta);

                points.push(new Point(x + x0, y + y0, z + z0));
            }
        }

        // anout edges
        for (let i = 0; i < points.length; i++) {
            if (i + 1 < points.length && (i + 1) % count !== 0) {
            // edges.push(new Edge(i, i + 1));
            } else {
            // edges.push(new Edge(i, i + 1 - count));
            }

            if (i + count < points.length) {
                edges.push(new Edge(i, i + count));
            } else {
                edges.push(new Edge(i, i % count));
            }
        }

        for (let i = 0; i < points.length; i++) {
            if (points[i + count + 1]) {
                polygons.push(new Polygon([
                    i,
                    i + 1,
                    i + count + 1,
                    i + count
                ], color));
            }
        }

        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = new Point(x0, y0, z0);
        return new Surface(points, edges, polygons, new Point(x0, y0, z0));
    }
}

export default Sphere;
    