import { TWIN3D } from "../Graph/Graph";
import Point from "./entites/Point";
import Polygon, { EDistance } from "./entites/Polygon";
import Surface from "./entites/Surface";

type TPlane = {
    A: number;
    B: number;
    C: number;

    x0: number;
    y0: number;
    z0: number;
    
    xs0: number;
    ys0: number;
    zs0: number;
}

type TMath3D = {
    WIN: TWIN3D;
    plane?: TPlane;
}

export type TObjectVector = {
    x: number;
    y: number;
    z: number;
}

export type TObjectPoint = {
    x: number;
    y: number;
    z: number;
}

type TMatrix = number[][];
type TVector = number[];
type TShadow = {
    isShadow: boolean;
    dark: number;
}

export enum ETransform {
    zoom = 'zoom',
    move = 'move',
    rotateOx = 'rotateOx',
    rotateOy = 'rotateOy',
    rotateOz = 'rotateOz',
}

class Math3D {
    WIN: TWIN3D;
    plane: TPlane;

    constructor({ WIN }: TMath3D) {
        this.WIN = WIN;
        this.plane = {
            A: 0,
            B: 0,
            C: 0,

            x0: 0,
            y0: 0,
            z0: 0,

            xs0: 0,
            ys0: 0,
            zs0: 0
        }
    }

    xs(point: Point): number {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const x0 = this.WIN.CAMERA.x;
        return (point.x - x0) / (point.z - z0) * (zs - z0) + x0;
    }

    ys(point: Point): number {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const y0 = this.WIN.CAMERA.y;
        return (point.y - y0) / (point.z - z0) * (zs - z0) + y0;
    }

    transform(matrix: TMatrix, point: Point): void {
        const { x, y, z } = point;
        const result = this.multPoint(matrix, [x, y, z, 1]);
        point.x = result[0];
        point.y = result[1];
        point.z = result[2];
    }

    multMatrix(T1: TMatrix, T2: TMatrix): TMatrix {
        const result = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let s = 0;
                for (let k = 0; k < 4; k++) {
                    s += T1[i][k] * T2[k][j];
                }
                result[i][j] = s;
            }
        }
        return result;
    };

    multPoint(T: TMatrix, m: TVector): TVector {
        const a = [0, 0, 0, 0];
        for (let i = 0; i < T.length; i++) {
            let b = 0;
            for (let j = 0; j < m.length; j++) {
                b += T[j][i] * m[j];
            }
            a[i] = b;
        }
        return a; 
    }

    getTransform(...args: TMatrix[]): TMatrix {
        return args.reduce(
            (S, t) => this.multMatrix(S, t),
            [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]
        );
    }

    [ETransform.zoom](delta: number): TMatrix {
        return [
            [delta, 0, 0, 0],
            [0, delta, 0, 0],
            [0, 0, delta, 0],
            [0, 0, 0, 1]
        ];
    }

    [ETransform.move](dx = 0, dy = 0, dz = 0): TMatrix {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [dx, dy, dz, 1]
        ];
    }

    [ETransform.rotateOx](alpha: number): TMatrix {
        return [
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, - Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    [ETransform.rotateOy](alpha: number): TMatrix {
        return [
            [Math.cos(alpha), 0, - Math.sin(alpha), 0],
            [0, 1, 0, 0],
            [Math.sin(alpha), 0, Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    [ETransform.rotateOz](alpha: number): TMatrix {
        return [
            [Math.cos(alpha), Math.sin(alpha), 0, 0],
            [- Math.sin(alpha), Math.cos(alpha), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    calcDistance(surface: Surface, endPoint: Point, name: EDistance): void {
        surface.polygons.forEach(polygon => {
            let x = 0, y = 0, z = 0;
            polygon.points.forEach(index => {
                x += surface.points[index].x;
                y += surface.points[index].y;
                z += surface.points[index].z;
            });
            x /= polygon.points.length;
            y /= polygon.points.length;
            z /= polygon.points.length;

            polygon[name] = Math.sqrt((endPoint.x - x) ** 2 + (endPoint.y - y) ** 2 + (endPoint.z - z) ** 2);
        });
    }

    sortByArtistAlgorithm(polygons: Polygon[]): void {
        polygons.sort((a, b) => (a.distance < b.distance) ? 1 : -1);
    }

    calcIllumination(distance: number, lumen: number): number {
        const illum = distance ? lumen / distance ** 2 : 1;
        return illum > 1 ? 1 : illum;
    }

    getVector(a:Point, b:Point): TObjectVector {
        return {
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z
        }
    }

    scalProd(a: TObjectVector, b: TObjectVector): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    multVector(a: TObjectVector, b: TObjectVector): TObjectVector {
        return {
            x: a.y * b.z - a.z * b.y,
            y: -a.x * b.z + a.z * b.x,
            z: a.x * b.y - a.y * b.x
        }
    }

    moduleVector(a: TObjectVector): number {
        return Math.sqrt(a.x**2 + a.y**2 + a.z**2);
    }

    calcPlaneEquation(point1: Point, point2: Point) {
        const vector = this.getVector(point1, point2);
        this.plane.A = vector.x;
        this.plane.B = vector.y;
        this.plane.C = vector.z;
        this.plane.x0 = point2.x;
        this.plane.y0 = point2.y;
        this.plane.z0 = point2.z;
        this.plane.xs0 = point1.x;
        this.plane.ys0 = point1.y;
        this.plane.zs0 = point1.z;
    }

    calcCorner(a: TObjectVector, b: Point | TObjectVector): number {
        return this.scalProd(a, b) / (Math.sqrt(this.scalProd(a, a)) * Math.sqrt(this.scalProd(b, b)));
    }

    getProection(point: Point): TObjectPoint {
        const { A, B, C, x0, y0, z0, xs0, ys0, zs0 } = this.plane;
        const m = point.x - xs0;
        const n = point.y - ys0;
        const p = point.z - zs0;
        const t = (A * (x0 - xs0) + B * (y0 - ys0) + C * (z0 - zs0)) / (A*m + B*n + C*p);
        const ps = {
            x: x0 + m * t, 
            y: y0 + n * t, 
            z: z0 + p * t 
        }
        return {
            x: ps.x - A, 
            y: ps.y - B, 
            z: ps.z - C 
        }
    }

    calcCenter(surface: Surface): void {
        const points = surface.points;
        surface.polygons.forEach(polygon => {
            const center = polygon.center;
            const p1 = points[polygon.points[0]];
            const p2 = points[polygon.points[1]];
            const p3 = points[polygon.points[2]];
            const p4 = points[polygon.points[3]];
            polygon.center = {
                x: (p1.x + p2.x + p3.x + p4.x)/4,
                y: (p1.y + p2.y + p3.y + p4.y)/4,
                z: (p1.z + p2.z + p3.z + p4.z)/4,
            };
        });
    }

    calcRadius(surface: Surface): void {
        const points = surface.points;
        surface.polygons.forEach(polygon => {
            const center = polygon.center;
            const p1 = points[polygon.points[0]];
            polygon.R = this.moduleVector(this.getVector(center, p1));
        });
    }

    calcShadow(polygon: Polygon, scene: Surface[], LIGHT: Point): TShadow {
        const M1 = polygon.center;
        const r = polygon.R;
        const result = {isShadow: false, dark: 0};
        const S = this.getVector(M1, LIGHT);
        scene.forEach((surface, index) => {
            if (polygon.index === index) return;
            surface.polygons.forEach(polygon2 => {
                const M0 = polygon2.center;
                if (M1.x === M0.x && M1.y === M0.y && M1.z === M0.z) return;
                if (polygon2.lumen > polygon.lumen) return;
                const dark = this.moduleVector(this.multVector(this.getVector(M0, M1), S)) / this.moduleVector(S);
                if (dark < r) {
                    result.isShadow = true;
                    result.dark = 0.7;
                }
            });
        });
        return result;
    }

    calcVisibiliy(surface: Surface, CAMERA: Point): void {
        const points = surface.points;
        surface.polygons.forEach(polygon => {
            const center = polygon.center;
            const p1 = points[polygon.points[0]];
            const p2 = points[polygon.points[1]];
            const a = this.getVector(center, p1);
            const b = this.getVector(center, p2);
            const normal = this.multVector(a, b);
            polygon.visibility = this.scalProd(normal, CAMERA) < 0;
        })
    }
}

export default Math3D;