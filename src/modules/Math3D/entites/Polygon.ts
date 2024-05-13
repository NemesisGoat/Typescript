import Point from "./Point";

export type TRGB = {
    r: number;
    g: number;
    b: number;
}

export enum EDistance {
    distance = 'distance',
    lumen = 'lumen'
}

class Polygon {
    points: number[];
    color: TRGB;
    center = new Point();
    [EDistance.distance]: number;
    [EDistance.lumen]: number;
    index: number;
    constructor(points = [], color = '#dc143c') {
        this.points = points;
        this.color = this.hexToRgb(color);
        this.distance = 0;
        this.lumen = 1;
        this.index = 0;
    }

    hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    rgbToHex(r:number, g:number, b:number) {
        return `rgb(${r}, ${g}, ${b})`;
    }
}

export default Polygon;