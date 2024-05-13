import { ETransform } from "../Math3D";
import Edge from "./Edge";
import Point from "./Point";
import Polygon from "./Polygon";

export type TAnimation = {
    method: ETransform;
    value: number;
    center: Point;
}

class Surface {
    points: Point[];
    edges: Edge[];
    polygons: Polygon[];
    center: Point;
    animation: TAnimation[];

    constructor(points = [], edges = [], polygons = [], center = new Point) {
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = center;
        this.animation = [];
    }

    dropAnimation() {
        this.animation = [];
    }

    addAnimation(method: ETransform, value:number, center?:Point): void {
        this.animation.push({ method, value, center: center || this.center });
    }

    doAnimation(math3D: any) {
        this.animation.forEach(anim => {
            const T1 = math3D.move(-anim.center.x, -anim.center.y, -anim.center.z);
            const T2 = math3D[anim.method](anim.value);
            const T3 = math3D.move(anim.center.x, anim.center.y, anim.center.z);
            const matrix = math3D.getTransform(T1, T2, T3);
            this.points.forEach(point => math3D.transform(matrix, point));
            math3D.transform(matrix, this.center);
        })
    }
}

export default Surface;