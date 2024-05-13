import { TWIN3D } from "../Graph/Graph";

export type TMath3D = {
    WIN: TWIN3D
}
type TMatrix = number[][];
type TVector = number[];
type TShadow = {
    isShadow: boolean;
    dark?: number;
};

export enum ETransform {
    zoom = 'zoom',
    move = 'move',
    rotateOx = 'rotateOx',
    rotateOy = 'rotateOy',
    rotateOz = 'rotateOz'
}

class Math3D {

    constructor({ WIN }) {
        this.WIN = WIN;
    }

    xs(point) {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const x0 = this.WIN.CAMERA.x;
        return (point.x - x0) / (point.z - z0) * (zs - z0) + x0;
    }

    ys(point) {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const y0 = this.WIN.CAMERA.y;
        return (point.y - y0) / (point.z - z0) * (zs - z0) + y0;
    }

    transform(matrix, point) {
        const { x, y, z } = point;
        const result = this.multPoint(matrix, [x, y, z, 1]);
        point.x = result[0];
        point.y = result[1];
        point.z = result[2];
    }

    multMatrix(T1, T2) {
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

    multPoint(T, m) {
        const a = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            let b = 0;
            for (let j = 0; j < 4; j++) {
                b += T[j][i] * m[j];
            }
            a[i] = b;
        }
        return a;
    }

    getTransform(...args) {
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

    [ETransform.rotateOx](alpha:number): TMatrix {
        return [
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, - Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    [ETransform.rotateOy](alpha:number): TMatrix {
        return [
            [Math.cos(alpha), 0, - Math.sin(alpha), 0],
            [0, 1, 0, 0],
            [Math.sin(alpha), 0, Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    [ETransform.rotateOz](alpha:number): TMatrix {
        return [
            [Math.cos(alpha), Math.sin(alpha), 0, 0],
            [- Math.sin(alpha), Math.cos(alpha), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    calcDistance(surface, endPoint, name) {
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

    sortByArtistAlgorithm(polygons) {
        polygons.sort((a, b) => (a.distance < b.distance) ? 1 : -1);
    }

    calcIllumination(distance, lumen) {
        const illum = distance ? lumen / distance ** 2 : 1;
        return illum > 1 ? 1 : illum;
    }
}

export default Math3D;