import Point from "../entites/Point";
import Edge from "../entites/Edge";
import Polygon from "../entites/Polygon";
import Surface from "../entites/Surface";

class Sphera extends Surface {
    constructor(
        count = 20,
        r = 10,
        color = '#ffff00',
        center = new Point
    ) {
        super();
        //x = (r * cos(psi) * cos(phi))
        //y = (r * cos(psi) * sin(phi))
        //z = r * sin(psi)
        //psi = -Pi...Pi
        //phi = 0...2 * Pi
        const da = Math.PI * 2 / count;
        const points = [];
        const edges = [];
        const polygons = [];
        for (let phi = 0; phi < Math.PI * 2; phi += da) {
            for (let psi = -Math.PI; psi < Math.PI; psi += da) {
                const x = center.x + r * Math.cos(psi) * Math.cos(phi);
                const y = center.y + r * Math.cos(psi) * Math.sin(phi);
                const z = center.z + r * Math.sin(psi);
                points.push(new Point(x, y, z));
            }
        }

        for (let i = 0; i < points.length; i++) {
            //грани в колечках
            if (points[i + 1]) {
                if ((i + 1) % count === 0) {
                    if (i - count >= 0)
                        edges.push(new Edge(i, i + 1 - count));
                } else {
                    edges.push(new Edge(i, i + 1));
                }
            }
            //грани между колечками
            if (points[i + count]) {
                edges.push(new Edge(i, i + count));
            } else {
                edges.push(new Edge(i, i % count));
            }
        }

        //полигоны
        for (let i = 0; i < points.length; i++) {
            if (points[i + 1 + count]) {
                polygons.push(new Polygon(
                    [
                        i,
                        i + 1,
                        i + 1 + count,
                        i + count,
                    ],
                    color
                ));
            }
        }

        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = center;
    }
}

export default Sphera;